import type { TagData, Internals, Eval, WeakSeparator, Recipe, InactiveBehavior, WeakFilter, WeakFilterResult } from './types'
import type { FlashcardTemplate, FlashcardPreset } from './flashcardTemplate'
import type { SortInStrategy } from './sortInStrategies'

import { makeFlashcardTemplate, generateFlashcardRecipes, toListStylize, ellipsis } from './flashcardTemplate'

import { Stylizer } from './stylizer'
import { sequencer } from './sequencer'
import { topUp } from './sortInStrategies'

const acrossTagShuffle = (sortIn: SortInStrategy) => <T extends {}>(tag: TagData, internals: Internals<T>): string[] | void => tag.values === null
    ? []
    : sequencer(
        `${tag.fullKey}:${tag.fullOccur}`,
        tag.fullKey,
        tag.values as string[],
        sortIn,
        internals,
    )

const justValues = <T extends {}>(tag: TagData, _internals: Internals<T>) => tag.values

const shuffleAndStylize = <T extends {}>(
    stylizer: Stylizer,
    ellipser: Eval<T, string[] | void>,
) => (tag: TagData, internals: Internals<T>): WeakFilterResult => {
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

const valuesInOrder = <T extends {}>(tag: TagData, _internals: Internals<T>) => tag.values

const doShuffle = <T extends FlashcardPreset>(stylizer: Stylizer, sortIn: SortInStrategy) => shuffleAndStylize(stylizer, acrossTagShuffle(sortIn) as Eval<T, string[] | void>)
const simplyShow = (stylizer: Stylizer, _sortIn: SortInStrategy) => toListStylize(stylizer, justValues)

const oneSidedShufflePublicApi = <T extends FlashcardPreset>(
    frontActive: (stylizer: Stylizer, sortIn: SortInStrategy) => WeakFilter<T>,
    backActive: (stylizer: Stylizer, sortIn: SortInStrategy) => WeakFilter<T>,
) => (
    frontInactive: InactiveBehavior<T>,
    backInactive: InactiveBehavior<T>,
): Recipe<T> => (options: {
    tagname?: string,

    inactiveStylizer?: Stylizer,
    contexter?: Eval<T, string[]>,
    ellipser?: WeakFilter<T>,

    activeStylizer?: Stylizer,

    sortInStrategy?: SortInStrategy,
    separator?: WeakSeparator,
    flashcardTemplate?: FlashcardTemplate<T>,
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
