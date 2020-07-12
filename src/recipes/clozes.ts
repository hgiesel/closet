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

const hintEllipser = <T extends {}>(
    tag: TagData,
    _internals: Internals<T>,
) => {
    return [tag.values[1] ?? '...']
}

const firstValue = <T extends object>(tag: TagData, { ready }: Internals<T>) => ({
    ready: ready,
    result: tag.values[0],
})

const firstValueAsList = <T extends object>(tag: TagData, _internals: Internals<T>) => [tag.values[0]]

const clozePublicApi = <T extends FlashcardPreset>(
    frontInactive: InactiveBehavior<T>,
    backInactive: InactiveBehavior<T>,
): Recipe<T> => (options: {
    tagname?: string,

    frontStylizer?: Stylizer,
    frontEllipser?: Eval<T, string[]>,

    backStylizer?: Stylizer,
    backEllipser?: Eval<T, string[]>,

    inactiveEllipser?: WeakFilter<T>,

    separator?: WeakSeparator,
    flashcardTemplate?: FlashcardTemplate<T>,
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
