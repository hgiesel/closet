import type { Tag, FilterApi, Internals, Ellipser } from './types'

import { Stylizer } from './stylizer'
import { fourWayRecipe } from './nway'
import { isBack, isActive } from './deciders'
import { sequencer } from './sequencer'
import { noneEllipser, stylizeEllipser  } from './ellipser'

const mcDefaultFrontStylizer = new Stylizer({
    separator: ', ',
    mapper: (v: string) => {
        return `<span style="color: orange;">${v}</span>`
    },
    postprocess: (v: string) => `( ${v} )`,
})

const mcDefaultBackStylizer = mcDefaultFrontStylizer.toStylizer({
    mapper: (v: string, _i, t: number) => {
        return `<span style="color: ${t === 0 ? 'lime' : 'red'};">${v}</span>`
    },
})

const defaultContexter = (tag: Tag, internals: Internals) => {
    const maybeValues = sequencer(
        `${tag.fullKey}:${tag.fullOccur}`,
        `${tag.fullKey}:${tag.fullOccur}`,
        tag.values[0],
        internals,
    )

    if (maybeValues) {
        const stylizer = new Stylizer()
        return stylizer.stylize(maybeValues)
    }
}

const activeBehavior = (
    stylizer: Stylizer,
) => (
    { values, fullKey, fullOccur }: Tag,
    internals: Internals,
) => {
    const flattedValuesWithIndex = (values as any).flatMap((v: string[], i: number) => v.map((w: string) => [w, i]))

    const maybeValues = sequencer(
        `${fullKey}:${fullOccur}`,
        `${fullKey}:${fullOccur}`,
        flattedValuesWithIndex,
        internals,
    )

    if (maybeValues) {
        return stylizer.stylize(
            maybeValues.map(v => v[0]),
            [maybeValues.map(v => v[1])],
        )
    }
}

const multipleChoiceTemplateRecipe = (
    backBehavior: (e: Ellipser, c: Ellipser) => (t: Tag, i: Internals) => string,
    frontBehavior: (e: Ellipser, c: Ellipser) => (t: Tag, i: Internals) => string,
) => ({
    tagname,
    switcherKeyword = 'switch',
    activateKeyword = 'activate',

    backStylizer = mcDefaultBackStylizer,
    frontStylizer = mcDefaultFrontStylizer,

    ellipser = noneEllipser,
    contexter = defaultContexter,
}) => (filterApi: FilterApi) => {
    const internalFilter = `${tagname}:internal`
    let activeOverwrite = false

    const multipleChoiceRecipe = fourWayRecipe(
        internalFilter,
        isBack,
        (t, inter) => isActive(t, inter) || activeOverwrite,
        /* back */
        activeBehavior(backStylizer),
        backBehavior(ellipser, contexter),
        /* front */
        activeBehavior(frontStylizer),
        frontBehavior(ellipser, contexter),
    )
    multipleChoiceRecipe(filterApi)

    const multipleChoiceFilter = (tag: Tag, inter: Internals) => {
        const theFilter = inter.cache.get(`${tagname}:${switcherKeyword}`, {
            get: (_k: string, _n: number | null, _o: number) => internalFilter,
        }).get(tag.key, tag.num, tag.fullOccur)

        activeOverwrite = inter.cache.get(`${tagname}:${activateKeyword}`, {
            get: (_k: string, _n: number | null, _o: number) => false,
        }).get(tag.key, tag.num, tag.fullOccur)

        return  inter.filters.get(theFilter)(tag, inter)
    }

    filterApi.register(tagname, multipleChoiceFilter)
}

const useEllipser = (e: Ellipser) => e
const useContexter = (_e: Ellipser, c: Ellipser) => c

export const multipleChoiceShowRecipe = multipleChoiceTemplateRecipe(useContexter, useContexter)
export const multipleChoiceHideRecipe = multipleChoiceTemplateRecipe(useEllipser, useEllipser)
export const multipleChoiceRevealRecipe = multipleChoiceTemplateRecipe(useContexter, useEllipser)
