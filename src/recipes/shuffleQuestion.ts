import type { TagData, Internals, Eval, WeakSeparator, Recipe, InactiveBehavior, WeakFilter, WeakFilterResult } from './types'
import type { FlashcardTemplate, FlashcardPreset } from './flashcardTemplate'
import type { SortInStrategy } from './sortInStrategies'

import { makeFlashcardTemplate, generateFlashcardRecipes, toListStylize, ellipsis } from './flashcardTemplate'

import { Stylizer } from './stylizer'
import { sequencer } from './sequencer'
import { topUp } from './sortInStrategies'

const acrossTagShuffle = (sortIn: SortInStrategy): Eval<{}, string[] | void> => (tag: TagData, internals: Internals<{}>) => {
    return sequencer(
        `${tag.fullKey}:${tag.fullOccur}`,
        tag.fullKey,
        tag.values,
        sortIn,
        internals,
    )
}

const justValues: Eval<{}, string[]> = (tag: TagData) => tag.values

const shuffleAndStylize = (
    stylizer: Stylizer,
    ellipser: Eval<{}, string[] | void>,
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

const valuesInOrder: Eval<FlashcardPreset, string[]> = (tag: TagData) => tag.values

const doShuffle = (stylizer: Stylizer, sortIn: SortInStrategy) => shuffleAndStylize(stylizer, acrossTagShuffle(sortIn))
const simplyShow = (stylizer: Stylizer, _sortIn: SortInStrategy) => toListStylize(stylizer, justValues)

const oneSidedShufflePublicApi = (
    frontActive: (stylizer: Stylizer, sortIn: SortInStrategy) => WeakFilter<FlashcardPreset>,
    backActive: (stylizer: Stylizer, sortIn: SortInStrategy) => WeakFilter<FlashcardPreset>,
) => (
    frontInactive: InactiveBehavior<FlashcardPreset, FlashcardPreset>,
    backInactive: InactiveBehavior<FlashcardPreset, FlashcardPreset>,
): Recipe<FlashcardPreset> => (options: {
    tagname?: string,

    inactiveStylizer?: Stylizer,
    contexter?: Eval<FlashcardPreset, string[]>,
    ellipser?: WeakFilter<FlashcardPreset>,

    activeStylizer?: Stylizer,

    sortInStrategy?: SortInStrategy,
    separator?: WeakSeparator,
    flashcardTemplate?: FlashcardTemplate,
} = {}) => {
    const {
        tagname = 'shuf',
        sortInStrategy = topUp,

        inactiveStylizer = inactive,
        contexter = valuesInOrder,
        ellipser = ellipsis,

        activeStylizer = blueHighlight,

        separator = { sep: '::' },
        flashcardTemplate = makeFlashcardTemplate(),
    } = options

    const clozeSeparators = { separators: [separator] }

    const front = frontActive(activeStylizer, sortInStrategy)
    const back = backActive(activeStylizer, sortInStrategy)

    const trueContexter = toListStylize(inactiveStylizer, contexter)

    const clozeRecipe = flashcardTemplate(frontInactive, backInactive)
    return clozeRecipe(tagname, front, back, trueContexter, ellipser, clozeSeparators)
}

export const [
    shuffleShowRecipe,
    shuffleHideRecipe,
    shuffleRevealRecipe,
] = generateFlashcardRecipes(oneSidedShufflePublicApi(doShuffle, doShuffle))

export const [
    sortShowRecipe,
    sortHideRecipe,
    sortRevealRecipe,
] = generateFlashcardRecipes(oneSidedShufflePublicApi(doShuffle, simplyShow))

export const [
    jumbleShowRecipe,
    jumbleHideRecipe,
    jumbleRevealRecipe,
] = generateFlashcardRecipes(oneSidedShufflePublicApi(simplyShow, doShuffle))
