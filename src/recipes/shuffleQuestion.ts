import type { TagData, Internals, Ellipser, WeakSeparator, Recipe, InactiveBehavior, ActiveBehavior, WeakFilterResult } from './types'
import type { FlashcardTemplate, FlashcardPreset } from './flashcardTemplate'
import type { SortInStrategy } from './sortInStrategies'

import { makeFlashcardTemplate, generateFlashcardRecipes, ellipsis, directApply } from './flashcardTemplate'

import { Stylizer } from './stylizer'
import { sequencer } from './sequencer'
import { topUp } from './sortInStrategies'

const acrossTagShuffle = (sortIn: SortInStrategy): Ellipser<{}, string[]> => (tag: TagData, internals: Internals<{}>) => {
    return sequencer(
        `${tag.fullKey}:${tag.fullOccur}`,
        tag.fullKey,
        tag.values,
        sortIn,
        internals,
    )
}

const justValues: Ellipser<{}, string[]> = (tag: TagData) => tag.values

const shuffleAndStylize: ActiveBehavior<FlashcardPreset, FlashcardPreset> = (
    stylizer: Stylizer,
    ellipser: Ellipser<{}, string[]>,
) => (tag: TagData, internals: Internals<FlashcardPreset>): WeakFilterResult => {
    const maybeValues = ellipser(tag, internals)

    return maybeValues
        ? stylizer.stylize(maybeValues)
        : { ready: false }
}

const inactive: Stylizer = new Stylizer({
    separator: ', ',
})

const blueHighlight: Stylizer = new Stylizer({
    processor: v => `<span style="color: cornflowerblue;">${v}</span>`,
})

const valuesInOrder: Ellipser<FlashcardPreset, string[]> = (tag: TagData) => tag.values

const shuffleQuestPublicApi = (
    frontInactive: InactiveBehavior<FlashcardPreset, FlashcardPreset>,
    backInactive: InactiveBehavior<FlashcardPreset, FlashcardPreset>,
): Recipe<FlashcardPreset> => (options: {
    tagname?: string,

    contexter?: Ellipser<FlashcardPreset, string[]>,
    ellipser?: Ellipser<FlashcardPreset, string[]>,

    activeStylizer?: Stylizer,

    sortInStrategy?: SortInStrategy,
    separator?: WeakSeparator,
    flashcardTemplate?: FlashcardTemplate,
} = {}) => {
    const {
        tagname = 'c',

        sortInStrategy = topUp,

        contexter = valuesInOrder,
        ellipser = ellipsis,

        activeStylizer = blueHighlight,

        separator = { sep: '::' },
        flashcardTemplate = makeFlashcardTemplate(),
    } = options

    const clozeSeparators = { separators: [separator] }
    const clozeRecipe = flashcardTemplate(frontInactive, backInactive)(shuffleAndStylize, directApply, clozeSeparators)

    const acrossTagShuffleWithStrategy = acrossTagShuffle(sortInStrategy)

    return clozeRecipe({
        tagname: tagname,

        inactiveStylizer: inactive,
        contexter: contexter,
        inactiveEllipser: ellipser,

        frontStylizer: activeStylizer,
        frontEllipser: acrossTagShuffleWithStrategy,

        backStylizer: activeStylizer,
        backEllipser: justValues,
    })
}

export const [
    shuffleShowRecipe,
    shuffleHideRecipe,
    shuffleRevealRecipe,
] = generateFlashcardRecipes(shuffleQuestPublicApi)
