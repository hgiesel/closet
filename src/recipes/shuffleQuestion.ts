import type { TagData, Internals, Eval, WeakSeparator, Recipe, InactiveBehavior, WeakFilter, WeakFilterResult } from './types'
import type { FlashcardTemplate, FlashcardPreset } from './flashcardTemplate'
import type { SortInStrategy } from './sortInStrategies'

import { makeFlashcardTemplate, generateFlashcardRecipes, toListStylize, ellipsis } from './flashcardTemplate'

import { Stylizer } from './stylizer'
import { withinTag } from './sequencer'
import { topUp } from './sortInStrategies'

const justValues = <T extends {}>(tag: TagData, _internals: Internals<T>) => tag.values

const shuffleAndStylize = <T extends {}>(
    stylizer: Stylizer,
    shuffler: Eval<T, string[] | void>,
) => (tag: TagData, internals: Internals<T>): WeakFilterResult => {
    const maybeValues = shuffler(tag, internals)

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

const simplyShow = <T extends {}>(stylizer: Stylizer, _shuffler: Eval<T, string[] | void>) => toListStylize(stylizer, justValues)

const oneSidedShufflePublicApi = <T extends FlashcardPreset>(
    frontActive: (stylizer: Stylizer, shuffler: Eval<T, string[] | void>) => WeakFilter<T>,
    backActive: (stylizer: Stylizer, shuffler: Eval<T, string[] | void>) => WeakFilter<T>,
) => (
    frontInactive: InactiveBehavior<T>,
    backInactive: InactiveBehavior<T>,
): Recipe<T> => (options: {
    tagname?: string,

    activeStylizer?: Stylizer,
    inactiveStylizer?: Stylizer,

    contexter?: Eval<T, string[]>,
    ellipser?: WeakFilter<T>,

    sequence?: <V extends [...any[]]>(getValues: Eval<T, V[]>, sortIn: SortInStrategy) => Eval<T, V[] | void>,

    sortInStrategy?: SortInStrategy,
    separator?: WeakSeparator,
    flashcardTemplate?: FlashcardTemplate<T>,
} = {}) => {
    const {
        tagname = 'shuf',
        sortInStrategy = topUp,

        activeStylizer = blueHighlight,
        inactiveStylizer = inactive,

        contexter = valuesInOrder,
        ellipser = ellipsis,

        sequence = withinTag,

        separator = { sep: '::' },
        flashcardTemplate = makeFlashcardTemplate(),
    } = options

    const clozeSeparators = { separators: [separator] }

    // @ts-ignore
    const shuffler: Eval<T, any[]> = sequence(contexter, sortInStrategy)

    const front = frontActive(activeStylizer, shuffler)
    const back = backActive(activeStylizer, shuffler)

    const trueContexter = toListStylize(inactiveStylizer, contexter)

    const clozeRecipe = flashcardTemplate(frontInactive, backInactive)
    return clozeRecipe(tagname, front, back, trueContexter, ellipser, clozeSeparators)
}

export const [
    shuffleShowRecipe,
    shuffleHideRecipe,
    shuffleRevealRecipe,
] = generateFlashcardRecipes(oneSidedShufflePublicApi(shuffleAndStylize, shuffleAndStylize))

export const [
    sortShowRecipe,
    sortHideRecipe,
    sortRevealRecipe,
] = generateFlashcardRecipes(oneSidedShufflePublicApi(shuffleAndStylize, simplyShow))

export const [
    jumbleShowRecipe,
    jumbleHideRecipe,
    jumbleRevealRecipe,
] = generateFlashcardRecipes(oneSidedShufflePublicApi(simplyShow, shuffleAndStylize))
