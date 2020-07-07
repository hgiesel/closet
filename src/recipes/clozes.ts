import type { TagData, Internals, Eval, WeakSeparator, Recipe, WeakFilter, InactiveBehavior } from './types'
import type { FlashcardTemplate, FlashcardPreset } from './flashcardTemplate'

import { makeFlashcardTemplate, ellipsis, toListStylize, generateFlashcardRecipes } from './flashcardTemplate'
import { Stylizer } from './stylizer'

const wrapWithBrackets = (v: string) => `[${v}]`

const blueHighlight: Stylizer = new Stylizer({
    processor: v => `<span style="color: cornflowerblue;">${v}</span>`,
})

const blueWithBrackets = blueHighlight.toStylizer({
    mapper: wrapWithBrackets,
})

const hintEllipser: Eval<FlashcardPreset, string[]> = (
    tag: TagData,
) => {
    return [tag.values[1] ?? '...']
}

const firstValue: Eval<FlashcardPreset, string> = (tag: TagData): string => tag.values[0]
const firstValueAsList = (tag: TagData, internals: Internals<{}>) => [firstValue(tag, internals)]

const clozePublicApi = (
    frontInactive: InactiveBehavior<FlashcardPreset, FlashcardPreset>,
    backInactive: InactiveBehavior<FlashcardPreset, FlashcardPreset>,
): Recipe<FlashcardPreset> => (options: {
    tagname?: string,

    frontStylizer?: Stylizer,
    frontEllipser?: Eval<FlashcardPreset, string[]>,

    backStylizer?: Stylizer,
    backEllipser?: Eval<FlashcardPreset, string[]>,

    inactiveEllipser?: WeakFilter<FlashcardPreset>,

    separator?: WeakSeparator,
    flashcardTemplate?: FlashcardTemplate,
} = {}) => {
    const {
        tagname = 'c',

        inactiveEllipser = ellipsis,

        frontStylizer = blueWithBrackets,
        frontEllipser = hintEllipser,

        backStylizer = blueHighlight,
        backEllipser = firstValueAsList,

        separator = { sep: '::', max: 2 },
        flashcardTemplate = makeFlashcardTemplate(),
    } = options

    const front = toListStylize(frontStylizer, frontEllipser)
    const back = toListStylize(backStylizer, backEllipser)

    const clozeSeparators = { separators: [separator] }
    const clozeRecipe = flashcardTemplate(frontInactive, backInactive)

    return clozeRecipe(tagname, front, back, firstValue, inactiveEllipser, clozeSeparators)
}

export const [
    clozeShowRecipe,
    clozeHideRecipe,
    clozeRevealRecipe,
] = generateFlashcardRecipes(clozePublicApi)
