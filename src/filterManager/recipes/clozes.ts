import type { TagData, Internals, Ellipser, Recipe, Separator, ActiveBehavior } from './types'

import { id, id2 } from './utils'
import { Stylizer } from './stylizer'
import { noneEllipser, stylizeEllipser } from './ellipser'
import { mcClozeTemplate } from './mcClozeTemplate'

const clozeFrontActiveBehavior: ActiveBehavior = (
    stylizer: Stylizer,
    activeEllipser: Ellipser,
) => (tag: TagData, internals: Internals) => {
    return stylizer.stylize([activeEllipser(tag, internals)])
}

const clozeSeparator: Separator = { sep: '::', max: 2 }

const clozeBackActiveBehavior: ActiveBehavior = (
    stylizer: Stylizer,
) => (tag: TagData) => {
    return stylizer.stylize([tag.values(clozeSeparator)[0]])
}

const clozeRecipe = mcClozeTemplate(clozeFrontActiveBehavior, clozeBackActiveBehavior)

const hintEllipser = stylizeEllipser(
    new Stylizer({
        postprocess: (v: string) => `[${v}]`,
    }),
    (tag: TagData) => {
        const vs = tag.values(clozeSeparator)
        return [vs[1] ?? '...']
    },
)

const defaultStylizer: Stylizer = new Stylizer({
    postprocess: v => `<span style="color: cornflowerblue;">${v}</span>`,
})

const joinValues: Ellipser = (tag: TagData): string => tag.values(clozeSeparator)[0]

const clozePublicApi = (
    clozeRecipe: Recipe,
): Recipe => (options: {
    tagname: string,
    switcherKeyword?: string,
    activateKeyword?: string,

    activeStylizer?: Stylizer,

    activeEllipser?: Ellipser,
    inactiveEllipser?: Ellipser,
}) => {
    const {
        tagname,
        switcherKeyword = 'switch',
        activateKeyword = 'activate',
        activeStylizer = defaultStylizer,
        activeEllipser = hintEllipser,
        inactiveEllipser = noneEllipser,
    } = options

    return clozeRecipe({
        tagname: tagname,
        switcherKeyword: switcherKeyword,
        activateKeyword: activateKeyword,

        frontStylizer: activeStylizer,
        backStylizer: activeStylizer,

        contexter: joinValues,
        activeEllipser: activeEllipser,
        inactiveEllipser: inactiveEllipser,
    })
}

export const clozeShowRecipe = clozePublicApi(clozeRecipe(id, id))
export const clozeHideRecipe = clozePublicApi(clozeRecipe(id2, id2))
export const clozeRevealRecipe = clozePublicApi(clozeRecipe(id2, id))
