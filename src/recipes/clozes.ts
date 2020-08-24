import type { TagNode, Internals, Eval, WeakSeparator, Recipe, WeakFilter, InactiveBehavior } from './types'
import type { FlashcardTemplate, FlashcardPreset } from './flashcardTemplate'
import type { StyleList } from './styleList'

import { makeFlashcardTemplate, ellipsis, generateFlashcardRecipes } from './flashcardTemplate'
import { listStylize } from './styleList'
import { Stylizer } from './stylizer'

const wrapWithBrackets = (v: string) => `[${v}]`

const blueHighlight: Stylizer = Stylizer.make({
    processor: v => `<span style="color: cornflowerblue;">${v}</span>`,
})

const blueWithBrackets = blueHighlight.toStylizer({
    mapper: wrapWithBrackets,
})

const hintEllipser = <T extends {}>(
    tag: TagNode,
    _internals: Internals<T>,
) => {
    return [tag.values[1] ?? '...']
}

const firstValue = <T extends object>(tag: TagNode, { ready }: Internals<T>) => ({
    ready: ready,
    result: tag.values[0],
})

const firstValueAsList = <T extends object>(tag: TagNode, _internals: Internals<T>) => [tag.values[0]]

const clozePublicApi = <T extends FlashcardPreset>(
    frontInactive: InactiveBehavior<T>,
    backInactive: InactiveBehavior<T>,
): Recipe<T> => (options: {
    tagname?: string,

    frontStylizer?: Stylizer,
    frontEllipser?: Eval<T, StyleList>,

    backStylizer?: Stylizer,
    backEllipser?: Eval<T, StyleList>,

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

    const front = listStylize(frontStylizer, frontEllipser)
    const back = listStylize(backStylizer, backEllipser)

    const clozeSeparators = { separators: [separator] }
    const clozeRecipe = flashcardTemplate(frontInactive, backInactive)

    return clozeRecipe(tagname, front, back, firstValue, inactiveEllipser, clozeSeparators)
}

export const [
    clozeShowRecipe,
    clozeHideRecipe,
    clozeRevealRecipe,
] = generateFlashcardRecipes(clozePublicApi)
