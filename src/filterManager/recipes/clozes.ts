import type { Tag, FilterApi, Internals, Ellipser } from './types'

import { Stylizer, rawStylizer } from './stylizer'
import { fourWayRecipe } from './nway'
import { isBack, isActive } from './deciders'
import { hintEllipser, noneEllipser } from './ellipser'
import { id } from './utils'

const defaultStylizer = new Stylizer({
    postprocess: v => `<span style="color: cornflowerblue;">${v}</span>`,
})

const joinValues = () => ({ values }: Tag): string => rawStylizer.stylize(values[0])

const clozeTemplateRecipe = (
    backBehavior: (e: Ellipser) => (t: Tag, i: Internals) => string,
    frontBehavior: (e: Ellipser) => (t: Tag, i: Internals) => string,
) => ({
    tagname = 'c',
    switcherKeyword = 'switch',
    activateKeyword = 'activate',

    activeStylizer = defaultStylizer,
    activeEllipser = hintEllipser,
    inactiveEllipser = noneEllipser,
} = {}) => (filterApi: FilterApi) => {
    const internalFilter = `${tagname}:internal`
    let activeOverwrite = false

    const clozeRecipe = fourWayRecipe(
        internalFilter,
        isBack,
        (t, inter) => isActive(t, inter) || activeOverwrite,
        /* back */
        (tag) => activeStylizer.stylize(tag.values[0]),
        backBehavior(inactiveEllipser),
        /* front */
        (tag, inter) => activeStylizer.stylize([
            activeEllipser(tag, inter)
        ]),
        frontBehavior(inactiveEllipser),
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

export const clozeShowRecipe = clozeTemplateRecipe(joinValues, joinValues)
export const clozeHideRecipe = clozeTemplateRecipe(id, id)
export const clozeRevealRecipe = clozeTemplateRecipe(id, joinValues)
