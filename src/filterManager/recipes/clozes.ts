import type { Tag } from '../../tags'
import type { FilterApi } from '../filters'
import type { Internals } from '..'
import { InnerStylizer } from './stylizer'
import { fourWayRecipe } from './nway'
import { isBack, isCurrent } from './deciders'
import { id } from './utils'

const defaultStylizer = new InnerStylizer({
    postprocess: v => `<span style="color: cornflowerblue;">${v}</span>`,
})

const defaultEllipsisMaker = ({ values }: Tag, _inter: Internals, _isCurrent: boolean): string => {
    return '[' + (
        values[1] ? values[1].join('||') : '...'
    ) + ']'
}

export const clozeHideRecipe = (
    keyword: string,

    currentStylizer = defaultStylizer,
    ellipsisMaker = defaultEllipsisMaker,
) => (filterApi: FilterApi) => {
    const makeEllipsis = (tag: Tag, inter: Internals) => ellipsisMaker(tag, inter, false)
    const internalFilter = `${keyword}:internal`

    const clozeRecipe = fourWayRecipe(
        internalFilter,
        isBack,
        isCurrent,
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
        const theFilter = inter.cache.get(`${keyword}:switcher`, (_k: string, _n: number | null) => internalFilter)(tag.key, tag.num)

        return  inter.filters.get(theFilter)(tag, inter)
    }

    filterApi.register(keyword, clozeFilter)
}

export const clozeShowRecipe = (
    keyword: string,

    currentStylizer = defaultStylizer,
    ellipsisMaker = defaultEllipsisMaker,
) => (filterApi: FilterApi) => {
    const valueJoiner = ({ values }: Tag) => values[0].join('||')
    const internalFilter = `${keyword}:internal`

    const clozeRecipe = fourWayRecipe(
        internalFilter,
        isBack,
        isCurrent,
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
        const theFilter = inter.cache.get(`${keyword}:switcher`, (_k: string, _n: number | null) => internalFilter)(tag.key, tag.num)

        return  inter.filters.get(theFilter)(tag, inter)
    }

    filterApi.register(keyword, clozeFilter)
}
