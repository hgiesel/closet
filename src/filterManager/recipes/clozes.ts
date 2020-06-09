import type { Tag } from '../../tags'
import type { FilterApi } from '../filters'
import type { Internals } from '..'
import { InnerStylizer } from './stylizer'
import { fourWayRecipe } from './nway'
import { isBack, isActive } from './deciders'
import { zeroWidthSpace } from './utils'

const defaultStylizer = new InnerStylizer({
    postprocess: v => `<span style="color: cornflowerblue;">${v}</span>`,
})

type EllipsisMaker = (t: Tag, i: Internals, isActive: boolean) => string

const defaultEllipsisMaker = ({ values }: Tag, _inter: Internals, isActive: boolean): string => {
    return zeroWidthSpace + '[' + (
        isActive && values[1] ? values[1].join('||') : '...'
    ) + ']' + zeroWidthSpace
}

const valueJoiner = () => ({ values }: Tag): string => values[0].join('||')
const makeEllipsis = (ellipsisMaker: EllipsisMaker) => (tag: Tag, inter: Internals) => ellipsisMaker(tag, inter, false)

const clozeTemplateRecipe = (
    backBehavior: (e: EllipsisMaker) => (t: Tag, i: Internals) => string,
    frontBehavior: (e: EllipsisMaker) => (t: Tag, i: Internals) => string,
) => ({
    tagname = 'c',
    switcherKeyword = 'switch',
    activateKeyword = 'activate',

    activeStylizer = defaultStylizer,
    ellipsisMaker = defaultEllipsisMaker,
} = {}) => (filterApi: FilterApi) => {
    const internalFilter = `${tagname}:internal`
    let activeOverwrite = false

    const clozeRecipe = fourWayRecipe(
        internalFilter,
        isBack,
        (t, inter) => isActive(t, inter) || activeOverwrite,
        /* back */
        (tag) => activeStylizer.stylizeInner(tag.values[0]),
        backBehavior(ellipsisMaker),
        /* front */
        (tag, inter) => activeStylizer.stylizeInner([
            ellipsisMaker(tag, inter, true)
        ]),
        frontBehavior(ellipsisMaker),
    )
    clozeRecipe(filterApi)

    const clozeFilter = (tag: Tag, inter: Internals) => {
        const theFilter = inter.cache.get(`${tagname}:${switcherKeyword}`, {
            get: (_k: string, _n: number | null, _o: number) => internalFilter,
        }).get(tag.key, tag.num, tag.fullOccur)

        activeOverwrite = inter.cache.get(`${tagname}:${activateKeyword}`, {
            get: (_k: string, _n: number | null, _o: number) => false,
        }).get(tag.key, tag.num, tag.fullOccur)

        return  inter.filters.get(theFilter)(tag, inter)
    }

    filterApi.register(tagname, clozeFilter)
}

export const clozeShowRecipe = clozeTemplateRecipe(valueJoiner, valueJoiner)
export const clozeHideRecipe = clozeTemplateRecipe(makeEllipsis, makeEllipsis)
export const clozeRevealRecipe = clozeTemplateRecipe(valueJoiner, makeEllipsis)
