import type { TagData, Internals, Ellipser, WeakSeparator, Recipe, InactiveBehavior, ActiveBehavior } from './types'
import type { FlashcardPreset } from './flashcardTemplate'

import { id, id2 } from './utils'
import { Stylizer } from './stylizer'
import { noneEllipser, stylizeEllipser } from './ellipser'
import { flashcardTemplate } from './flashcardTemplate'

const clozeFrontActiveBehavior: ActiveBehavior<FlashcardPreset, FlashcardPreset> = (
    stylizer: Stylizer,
    activeEllipser: Ellipser<FlashcardPreset>,
) => (tag: TagData, internals: Internals<FlashcardPreset>) => {
    return stylizer.stylize([activeEllipser(tag, internals)])
}

const clozeBackActiveBehavior: ActiveBehavior<FlashcardPreset, FlashcardPreset> = (
    stylizer: Stylizer,
) => (tag: TagData) => {
    return stylizer.stylize([tag.values[0]])
}

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

const joinValues: Ellipser<FlashcardPreset> = (tag: TagData): string => tag.values[0]

const clozePublicApi = (
    choice1: InactiveBehavior<FlashcardPreset, FlashcardPreset>,
    choice2: InactiveBehavior<FlashcardPreset, FlashcardPreset>,
): Recipe<FlashcardPreset> => (options: {
    tagname?: string,

    switcherKeyword?: string,
    activeKeyword?: string,
    bottomRangeKeyword?: string,
    topRangeKeyword?: string,

    activeStylizer?: Stylizer,

    activeEllipser?: Ellipser<FlashcardPreset>,
    inactiveEllipser?: Ellipser<FlashcardPreset>,

    separator?: WeakSeparator,
} = {}) => {
    const {
        tagname = 'c',

        switcherKeyword = 'switch',
        activeKeyword = 'active',
        bottomRangeKeyword = 'bottom',
        topRangeKeyword = 'top',

        activeStylizer = defaultStylizer,
        activeEllipser = hintEllipser,
        inactiveEllipser = noneEllipser,
        separator = { sep: '::', max: 2},
    } = options

    const clozeSeparators = { separators: [separator] }
    const clozeRecipe = flashcardTemplate(clozeFrontActiveBehavior, clozeBackActiveBehavior, clozeSeparators)(choice1, choice2)

    return clozeRecipe({
        tagname: tagname,

        switcherKeyword: switcherKeyword,
        activeKeyword: activeKeyword,
        bottomRangeKeyword: bottomRangeKeyword,
        topRangeKeyword: topRangeKeyword,

        frontStylizer: activeStylizer,
        backStylizer: activeStylizer,

        contexter: joinValues,
        activeEllipser: activeEllipser,
        inactiveEllipser: inactiveEllipser,
    })
}

export const clozeShowRecipe = clozePublicApi(id, id)
export const clozeHideRecipe = clozePublicApi(id2, id2)
export const clozeRevealRecipe = clozePublicApi(id2, id)
