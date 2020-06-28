import type { TagData, Internals, Ellipser, Recipe, ActiveBehavior } from './types'
import type { McClozePreset } from './mcClozeTemplate'

import { id, id2 } from './utils'
import { Stylizer } from './stylizer'
import { noneEllipser, stylizeEllipser } from './ellipser'
import { mcClozeTemplate } from './mcClozeTemplate'

const clozeFrontActiveBehavior: ActiveBehavior<McClozePreset, McClozePreset> = (
    stylizer: Stylizer,
    activeEllipser: Ellipser<McClozePreset>,
) => (tag: TagData, internals: Internals<McClozePreset>) => {
    return stylizer.stylize([activeEllipser(tag, internals)])
}

const clozeBackActiveBehavior: ActiveBehavior<McClozePreset, McClozePreset> = (
    stylizer: Stylizer,
) => (tag: TagData) => {
    return stylizer.stylize([tag.values[0]])
}

const clozeSeparators = { separators: [{ sep: '::', max: 2 }]}

const clozeRecipe = mcClozeTemplate(clozeFrontActiveBehavior, clozeBackActiveBehavior, clozeSeparators)

const hintEllipser = stylizeEllipser(
    new Stylizer({
        processor: (v: string) => `[${v}]`,
    }),
    (tag: TagData) => {
        const vs = tag.values
        return [vs[1] ?? '...']
    },
)

const defaultStylizer: Stylizer = new Stylizer({
    processor: v => `<span style="color: cornflowerblue;">${v}</span>`,
})

const joinValues: Ellipser<McClozePreset> = (tag: TagData): string => tag.values[0]

const clozePublicApi = (
    clozeRecipe: Recipe<McClozePreset>,
): Recipe<McClozePreset> => (options: {
    tagname?: string,
    switcherKeyword?: string,
    activateKeyword?: string,

    activeStylizer?: Stylizer,

    activeEllipser?: Ellipser<McClozePreset>,
    inactiveEllipser?: Ellipser<McClozePreset>,
} = {}) => {
    const {
        tagname = 'c',
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
