import type { TagData, Internals, Ellipser, WeakSeparator, Recipe, InactiveBehavior, ActiveBehavior } from './types'
import type { FlashcardTemplate, FlashcardPreset } from './flashcardTemplate'

import { makeFlashcardTemplate, ellipsis, directApply, generateFlashcardRecipes } from './flashcardTemplate'
import { Stylizer } from './stylizer'

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

const clozePublicApi = (
    frontInactive: InactiveBehavior<FlashcardPreset, FlashcardPreset>,
    backInactive: InactiveBehavior<FlashcardPreset, FlashcardPreset>,
): Recipe<FlashcardPreset> => (options: {
    tagname?: string,

    frontStylizer?: Stylizer,
    frontEllipser?: Ellipser<FlashcardPreset, string[]>,

    backStylizer?: Stylizer,
    backEllipser?: Ellipser<FlashcardPreset, string[]>,

    inactiveEllipser?: Ellipser<FlashcardPreset, string[]>,

    separator?: WeakSeparator,
    flashcardTemplate?: FlashcardTemplate,
} = {}) => {
    const {
        tagname = 'c',

        inactiveEllipser = ellipsis,

        frontStylizer = blueWithBrackets,
        frontEllipser = hintEllipser,

        backStylizer = blueHighlight,
        backEllipser = firstValue,

        separator = { sep: '::', max: 2 },
        flashcardTemplate = makeFlashcardTemplate(),
    } = options

    const clozeSeparators = { separators: [separator] }
    const clozeRecipe = flashcardTemplate(frontInactive, backInactive)(directApply, directApply, clozeSeparators)

    return clozeRecipe({
        tagname: tagname,

        inactiveStylizer: inactive,
        contexter: firstValue,
        inactiveEllipser: inactiveEllipser,

        frontStylizer: frontStylizer,
        frontEllipser: frontEllipser,

        backStylizer: backStylizer,
        backEllipser: backEllipser,
    })
}

export const [
    clozeShowRecipe,
    clozeHideRecipe,
    clozeRevealRecipe,
] = generateFlashcardRecipes(clozePublicApi)
