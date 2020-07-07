import type { TagData, Internals, Ellipser, WeakSeparator, Recipe, InactiveBehavior, ActiveBehavior } from './types'
import type { FlashcardTemplate, FlashcardPreset } from './flashcardTemplate'

import { makeFlashcardTemplate, choose, ellipsis } from './flashcardTemplate'
import { Stylizer } from './stylizer'
import { id, id2 } from './utils'

const ellipseThenStylize: ActiveBehavior<FlashcardPreset, FlashcardPreset> = (
    stylizer: Stylizer,
    activeEllipser: Ellipser<FlashcardPreset, string[]>,
) => (tag: TagData, internals: Internals<FlashcardPreset>) => {
    return stylizer.stylize(activeEllipser(tag, internals))
}
const wrapWithBrackets = (v: string) => `[${v}]`

const inactive = new Stylizer()

const hintEllipser: Ellipser<FlashcardPreset, string[]> = (
    tag: TagData,
) => {
    return [tag.values[1] ?? '...']
}

const blueHighlight: Stylizer = new Stylizer({
    processor: v => `<span style="color: cornflowerblue;">${v}</span>`,
})

const blueWithBrackets = blueHighlight.toStylizer({
    mapper: wrapWithBrackets,
})

const firstValue: Ellipser<FlashcardPreset, string[]> = (tag: TagData): string[] => [tag.values[0]]

const stylizeFirstValueOnly: ActiveBehavior<FlashcardPreset, FlashcardPreset> = (
    stylizer: Stylizer,
) => (tag: TagData, internals: Internals<FlashcardPreset>) => {
    return stylizer.stylize(firstValue(tag, internals))
}

const clozePublicApi = (
    frontInactive: InactiveBehavior<FlashcardPreset, FlashcardPreset>,
    backInactive: InactiveBehavior<FlashcardPreset, FlashcardPreset>,
): Recipe<FlashcardPreset> => (options: {
    tagname?: string,

    frontStylizer?: Stylizer,
    backStylizer?: Stylizer,
    activeEllipser?: Ellipser<FlashcardPreset, string[]>,
    inactiveEllipser?: Ellipser<FlashcardPreset, string[]>,

    separator?: WeakSeparator,
    flashcardTemplate?: FlashcardTemplate,
} = {}) => {
    const {
        tagname = 'c',

        inactiveEllipser = ellipsis,

        frontStylizer = blueWithBrackets,
        backStylizer = blueHighlight,
        activeEllipser = hintEllipser,

        separator = { sep: '::', max: 2 },
        flashcardTemplate = makeFlashcardTemplate(),
    } = options

    const clozeSeparators = { separators: [separator] }
    const clozeRecipe = flashcardTemplate(frontInactive, backInactive)(ellipseThenStylize, stylizeFirstValueOnly, clozeSeparators)

    return clozeRecipe({
        tagname: tagname,

        inactiveStylizer: inactive,
        contexter: firstValue,
        inactiveEllipser: inactiveEllipser,

        frontStylizer: frontStylizer,
        backStylizer: backStylizer,
        activeEllipser: activeEllipser,
    })
}

export const clozeShowRecipe = clozePublicApi(choose(id), choose(id))
export const clozeHideRecipe = clozePublicApi(choose(id2), choose(id2))
export const clozeRevealRecipe = clozePublicApi(choose(id2), choose(id))
