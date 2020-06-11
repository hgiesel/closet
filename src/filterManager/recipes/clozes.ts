import type { Tag, FilterApi, Internals, Ellipser } from './types'

import { id } from './utils'
import { fourWayWrap } from './nway'

import { Stylizer, rawStylizer } from './stylizer'
import { isBack, isActive } from './deciders'
import { noneEllipser, stylizeEllipser, toSimpleRecipe } from './ellipser'

const hintEllipser = stylizeEllipser(
    rawStylizer.toStylizer({
        postprocess: v => `[${v}]`,
    }),
    (v: string[][]) => v[1] ?? ['...'],
)

const defaultStylizer = new Stylizer({
    postprocess: v => `<span style="color: cornflowerblue;">${v}</span>`,
})

const joinValues = () => ({ values }: Tag): string => rawStylizer.stylize(values[0])

const clozeTemplateRecipe = (
    frontBehavior: (e: Ellipser) => (t: Tag, i: Internals) => string,
    backBehavior: (e: Ellipser) => (t: Tag, i: Internals) => string,
) => ({
    tagname,
    switcherKeyword = 'switch',
    activateKeyword = 'activate',

    activeStylizer = defaultStylizer,
    activeEllipser = hintEllipser,
    inactiveEllipser = noneEllipser,
}) => (filterApi: FilterApi) => {
    const internalFilter = `${tagname}:internal`
    let activeOverwrite = false

    const isActiveWithOverwrite = (t: Tag, inter: Internals) => isActive(t, inter) || activeOverwrite

    const clozeRecipe = fourWayWrap(
        isActiveWithOverwrite,
        isBack,
        /* front inactive */
        toSimpleRecipe(frontBehavior(inactiveEllipser)),
        /* front active */
        toSimpleRecipe((tag: Tag, inter: Internals) => activeStylizer.stylize([
            activeEllipser(tag, inter)
        ])),
        /* back inactive */
        toSimpleRecipe(backBehavior(inactiveEllipser)),
        /* back active */
        toSimpleRecipe((tag: Tag) => activeStylizer.stylize(tag.values[0])),
    )

    clozeRecipe({ tagname: internalFilter })(filterApi)

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
