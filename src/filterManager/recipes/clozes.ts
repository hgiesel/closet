import type { Tag, Internals, Ellipser, Recipe, ActiveBehavior } from './types'

import { id, id2 } from './utils'
import { Stylizer, rawStylizer } from './stylizer'
import { noneEllipser, stylizeEllipser } from './ellipser'
import { mcClozeTemplate } from './mcClozeTemplate'

const clozeFrontActiveBehavior: ActiveBehavior = (
    stylizer: Stylizer,
    activeEllipser: Ellipser,
) => (tag: Tag, internals: Internals) => {
    return stylizer.stylize([activeEllipser(tag, internals)])
}

const clozeBackActiveBehavior: ActiveBehavior = (
    stylizer: Stylizer,
) => (tag: Tag) => {
    return stylizer.stylize(tag.values[0])
}

const clozeRecipe = mcClozeTemplate(clozeFrontActiveBehavior, clozeBackActiveBehavior)

const hintEllipser = stylizeEllipser(
    rawStylizer.toStylizer({
        postprocess: v => `[${v}]`,
    }),
    (v: string[][]) => v[1] ?? ['...'],
)

const defaultStylizer: Stylizer = new Stylizer({
    postprocess: v => `<span style="color: cornflowerblue;">${v}</span>`,
})

const joinValues: Ellipser = ({ values }: Tag): string => rawStylizer.stylize(values[0])

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
