
import type { Tag, FilterApi, Internals } from './types'

import { Stylizer } from './stylizer'
import { fourWayRecipe } from './nway'
import { isBack, isActive } from './deciders'
import { sequencer } from './sequencer'

const mcDefaultFrontStylizer = new Stylizer({
    separator: ', ',
    mapper: (v: string) => {
        return `<span style="color: orange;">${v}</span>`
    },
    postprocess: (v: string) => `( ${v} )`,
})

const mcDefaultBackStylizer = mcDefaultFrontStylizer.toStylizer({
    mapper: (v: string, t: number) => {
        return `<span style="color: ${t === 0 ? 'lime' : 'red'};">${v}</span>`
    },
})

const defaultEllipsisMaker = ({ values }: Tag, _inter: Internals, _isActive: boolean): string => {
    return '[...]'
}

const defaultContextMaker = () => ({ values }: Tag): string => values[0].join('||')

const multipleChoiceTemplateRecipe = (
    backBehavior: (e: EllipsisMaker, c: ContentMaker) => (t: Tag, i: Internals) => string,
    frontBehavior: (e: EllipsisMaker) => (t: Tag, i: Internals) => string,
) => ({
    tagname = 'c',
    switcherKeyword = 'switch',
    activateKeyword = 'activate',

    frontStylizer = mcDefaultFrontStylizer,
    backStylizer = mcDefaultBackStylizer,

    ellipsisMaker = defaultEllipsisMaker,
    contextMaker = defaultContextMaker,
} = {}) => (filterApi: FilterApi) => {
    const internalFilter = `${tagname}:internal`
    let activeOverwrite = false

    const clozeRecipe = fourWayRecipe(
        internalFilter,
        isBack,
        (t, inter) => isActive(t, inter) || activeOverwrite,
        /* back */
        (tag) => activeStylizer.stylize(tag.values[0]),
        backBehavior(ellipsisMaker),
        /* front */
        (tag, inter) => activeStylizer.stylize([
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
