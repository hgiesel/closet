import type { Tag } from '../../tags'
import type { FilterApi } from '../filters'
import type { Internals } from '..'
import { InnerStylizer } from './stylizer'
import { fourWayRecipe } from './nway'
import { isBack, isCurrent } from './deciders'

const defaultStylizer = new InnerStylizer({
    postprocess: v => `<span style="color: cornflowerblue;">${v}</span>`,
})

const defaultEllipsisMaker = ({ values }: Tag, _inter: Internals, _isCurrent: boolean): string => {
    return '[' + (
        values[1] ? values[1].join('||') : '...'
    ) + ']'
}

export const clozeShowRecipe = ({
    keyword = 'c',
    switcherKeyword = 'switch',
    activateKeyword = 'activate',

    currentStylizer = defaultStylizer,
    ellipsisMaker = defaultEllipsisMaker,
} = {}) => (filterApi: FilterApi) => {
    const valueJoiner = ({ values }: Tag) => values[0].join('||')
    const internalFilter = `${keyword}:internal`
    let currentOverwrite = false

    const clozeRecipe = fourWayRecipe(
        internalFilter,
        isBack,
        (t, inter) => isCurrent(t, inter) || currentOverwrite,
        /* back */
        (tag) => currentStylizer.stylizeInner(tag.values[0]),
        valueJoiner,
        /* front */
        (tag, inter) => currentStylizer.stylizeInner([
            ellipsisMaker(tag, inter, true)
        ]),
        valueJoiner,
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

export const clozeHideRecipe = ({
    keyword = 'ch',
    switcherKeyword = 'switch',
    activateKeyword = 'activate',

    currentStylizer = defaultStylizer,
    ellipsisMaker = defaultEllipsisMaker,
} = {}) => (filterApi: FilterApi) => {
    const makeEllipsis = (tag: Tag, inter: Internals) => ellipsisMaker(tag, inter, false)
    const internalFilter = `${keyword}:internal`
    let currentOverwrite = false

    const clozeRecipe = fourWayRecipe(
        internalFilter,
        isBack,
        (t, inter) => isCurrent(t, inter) || currentOverwrite,
        /* back */
        (tag) => currentStylizer.stylizeInner(tag.values[0]),
        makeEllipsis,
        /* front */
        (tag, inter) => currentStylizer.stylizeInner([
            ellipsisMaker(tag, inter, true)
        ]),
        makeEllipsis,
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

