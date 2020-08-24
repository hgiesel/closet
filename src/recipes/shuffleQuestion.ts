import type { TagNode, Internals, Eval, WeakSeparator, Recipe, InactiveBehavior, WeakFilter } from './types'
import type { FlashcardTemplate, FlashcardPreset } from './flashcardTemplate'
import type { SortInStrategy } from './sortInStrategies'
import type { StyleList } from './styleList'

import { makeFlashcardTemplate, generateFlashcardRecipes, ellipsis } from './flashcardTemplate'
import { listStylize, listStylizeMaybe } from './styleList'

import { Stylizer } from './stylizer'
import { acrossTag } from './sequencer'
import { topUp } from './sortInStrategies'

const justValues = <T extends {}>(tag: TagNode, _internals: Internals<T>) => tag.values

const inactive: Stylizer = Stylizer.make({
    separator: ', ',
})

const blueHighlight: Stylizer = Stylizer.make({
    processor: v => `<span style="color: cornflowerblue;">${v}</span>`,
})

const valuesInOrder = <T extends {}>(tag: TagNode, _internals: Internals<T>): StyleList => tag.values ? tag.values : []

const simplyShow = <T extends {}, V extends StyleList>(stylizer: Stylizer, _shuffler: Eval<T, V | void>) => listStylize(stylizer, justValues)

const oneSidedShufflePublicApi = <T extends FlashcardPreset, V extends StyleList >(
    frontActive: (stylizer: Stylizer, shuffler: Eval<T, V | void>) => WeakFilter<T>,
    backActive: (stylizer: Stylizer, shuffler: Eval<T, V | void>) => WeakFilter<T>,
) => (
    frontInactive: InactiveBehavior<T>,
    backInactive: InactiveBehavior<T>,
): Recipe<T> => (options: {
    tagname?: string,

    activeStylizer?: Stylizer,
    inactiveStylizer?: Stylizer,

    contexter?: Eval<T, V>,
    ellipser?: WeakFilter<T>,

    sequence?: (getValues: Eval<T, V>, sortIn: SortInStrategy) => Eval<T, V | void>,

    sortInStrategy?: SortInStrategy,
    separator?: WeakSeparator,
    flashcardTemplate?: FlashcardTemplate<T>,
} = {}) => {
    const {
        tagname = 'shuf',

        activeStylizer = blueHighlight,
        inactiveStylizer = inactive,

        contexter = valuesInOrder,
        ellipser = ellipsis,

        sequence = acrossTag,
        sortInStrategy = topUp,

        separator = { sep: '::' },
        flashcardTemplate = makeFlashcardTemplate(),
    } = options

    const clozeSeparators = { separators: [separator] }

    // @ts-ignore
    const shuffler: Eval<T, V> = sequence(contexter, sortInStrategy)

    const front = frontActive(activeStylizer, shuffler)
    const back = backActive(activeStylizer, shuffler)

    const trueContexter = listStylize(inactiveStylizer, contexter)

    const clozeRecipe = flashcardTemplate(frontInactive, backInactive)
    return clozeRecipe(tagname, front, back, trueContexter, ellipser, clozeSeparators)
}

export const [
    shuffleShowRecipe,
    shuffleHideRecipe,
    shuffleRevealRecipe,
] = generateFlashcardRecipes(oneSidedShufflePublicApi(listStylizeMaybe, listStylizeMaybe))

export const [
    sortShowRecipe,
    sortHideRecipe,
    sortRevealRecipe,
] = generateFlashcardRecipes(oneSidedShufflePublicApi(listStylizeMaybe, simplyShow))

export const [
    jumbleShowRecipe,
    jumbleHideRecipe,
    jumbleRevealRecipe,
] = generateFlashcardRecipes(oneSidedShufflePublicApi(simplyShow, listStylizeMaybe))
