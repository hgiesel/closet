import type { Tag } from '../../tags'
import type { FilterApi } from '../filters'
import type { Internals } from '..'
import { InnerStylizer } from './stylizer'
import { fourWayRecipe } from './nway'
import { isBack, isCurrent } from './deciders'
import { zeroWidthSpace } from './utils'

const defaultStylizer = new InnerStylizer({
    postprocess: v => `<span style="color: cornflowerblue;">${v}</span>`,
})

type EllipsisMaker = (t: Tag, i: Internals, isCurrent: boolean) => string

const defaultEllipsisMaker = ({ values }: Tag, _inter: Internals, _isCurrent: boolean): string => {
    return zeroWidthSpace + '[' + (
        values[1] ? values[1].join('||') : '...'
    ) + ']' + zeroWidthSpace
}

const valueJoiner = () => ({ values }: Tag): string => values[0].join('||')
const makeEllipsis = (ellipsisMaker: EllipsisMaker) => (tag: Tag, inter: Internals) => ellipsisMaker(tag, inter, false)

const clozeTemplateRecipe = (
    backBehavior: (e: EllipsisMaker) => (t: Tag, i: Internals) => string,
    frontBehavior: (e: EllipsisMaker) => (t: Tag, i: Internals) => string,
) => (
    keyword = 'c', {
    switcherKeyword = 'switch',
    activateKeyword = 'activate',

    currentStylizer = defaultStylizer,
    ellipsisMaker = defaultEllipsisMaker,
} = {}) => (filterApi: FilterApi) => {
    const internalFilter = `${keyword}:internal`
    let currentOverwrite = false

    const clozeRecipe = fourWayRecipe(
        internalFilter,
        isBack,
        (t, inter) => isCurrent(t, inter) || currentOverwrite,
        /* back */
        (tag) => currentStylizer.stylizeInner(tag.values[0]),
        backBehavior(ellipsisMaker),
        /* front */
        (tag, inter) => currentStylizer.stylizeInner([
            ellipsisMaker(tag, inter, true)
        ]),
        frontBehavior(ellipsisMaker),
    )
    clozeRecipe(filterApi)

    const clozeFilter = (tag: Tag, inter: Internals) => {
        const theFilter = inter.cache.get(`${keyword}:${switcherKeyword}`, {
            get: (_k: string, _n: number | null, _o: number) => internalFilter,
        }).get(tag.key, tag.num, tag.fullOccur)

        currentOverwrite = inter.cache.get(`${keyword}:${activateKeyword}`, {
            get: (_k: string, _n: number | null, _o: number) => false,
        }).get(tag.key, tag.num, tag.fullOccur)

        return  inter.filters.get(theFilter)(tag, inter)
    }

    filterApi.register(keyword, clozeFilter)
}

export const clozeShowRecipe = clozeTemplateRecipe(valueJoiner, valueJoiner)
export const clozeHideRecipe = clozeTemplateRecipe(makeEllipsis, makeEllipsis)
export const clozeRevealRecipe = clozeTemplateRecipe(valueJoiner, makeEllipsis)


