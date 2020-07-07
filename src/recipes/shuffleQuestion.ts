import type { TagData, Internals, Ellipser, WeakSeparator, Recipe, InactiveBehavior, ActiveBehavior } from './types'
import type { FlashcardTemplate, FlashcardPreset } from './flashcardTemplate'

import { makeFlashcardTemplate } from './flashcardTemplate'

import { Stylizer } from './stylizer'
import { noneEllipser, stylizeEllipser } from './ellipser'

import { id, id2 } from './utils'

const ellipseThenStylize: ActiveBehavior<FlashcardPreset, FlashcardPreset> = (
    stylizer: Stylizer,
    activeEllipser: Ellipser<FlashcardPreset>,
) => (tag: TagData, internals: Internals<FlashcardPreset>) => {
    return stylizer.stylize([activeEllipser(tag, internals)])
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

const blueHighlight: Stylizer = new Stylizer({
    processor: v => `<span style="color: cornflowerblue;">${v}</span>`,
})

const firstValue: Ellipser<FlashcardPreset> = (tag: TagData): string => tag.values[0]

const stylizeFirstValueOnly: ActiveBehavior<FlashcardPreset, FlashcardPreset> = (
    stylizer: Stylizer,
) => (tag: TagData, internals: Internals<FlashcardPreset>) => {
    return stylizer.stylize([firstValue(tag, internals)])
}

const shuffleQuestPublicApi = (
    frontInactive: InactiveBehavior<FlashcardPreset, FlashcardPreset>,
    backInactive: InactiveBehavior<FlashcardPreset, FlashcardPreset>,
): Recipe<FlashcardPreset> => (options: {
    tagname?: string,

    activeStylizer?: Stylizer,
    activeEllipser?: Ellipser<FlashcardPreset>,
    inactiveEllipser?: Ellipser<FlashcardPreset>,

    separator?: WeakSeparator,
    flashcardTemplate?: FlashcardTemplate,
} = {}) => {
    const {
        tagname = 'c',

        inactiveEllipser = noneEllipser,

        activeStylizer = blueHighlight,
        activeEllipser = hintEllipser,

        separator = { sep: '::', max: 2 },
        flashcardTemplate = makeFlashcardTemplate(),
    } = options

    const clozeSeparators = { separators: [separator] }
    const clozeRecipe = flashcardTemplate(frontInactive, backInactive)(ellipseThenStylize, stylizeFirstValueOnly, clozeSeparators)

    return clozeRecipe({
        tagname: tagname,

        contexter: firstValue,
        inactiveEllipser: inactiveEllipser,

        frontStylizer: activeStylizer,
        backStylizer: activeStylizer,
        activeEllipser: activeEllipser,
    })
}

export const shuffleShowRecipe = shuffleQuestPublicApi(id, id)
export const shuffleHideRecipe = shuffleQuestPublicApi(id2, id2)
export const shuffleRevealRecipe = shuffleQuestPublicApi(id2, id)
