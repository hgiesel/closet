import type { TagNode, Internals, Eval, WeakSeparator, Recipe, InactiveBehavior, WeakFilter } from '../types'
import type { SortInStrategy } from '../sortInStrategies'
import type { StyleList } from '../styleList'
import type { FlashcardTemplate, FlashcardPreset } from './flashcardTemplate'

import { listStylize, listStylizeMaybe } from '../styleList'
import { makeFlashcardTemplate, generateFlashcardRecipes, ellipsis } from './flashcardTemplate'

import { Stylizer } from '../stylizer'
import { acrossTag } from '../sequencers'
import { topUp } from '../sortInStrategies'

const justValues = <T extends Record<string, unknown>>(tag: TagNode, _internals: Internals<T>) => tag.values

const inactive: Stylizer = Stylizer.make({
    separator: ', ',
})

const blueHighlight: Stylizer = Stylizer.make({
    processor: v => `<span style="color: cornflowerblue;">${v}</span>`,
})

const valuesInOrder = <T extends Record<string, unknown>>(tag: TagNode, _internals: Internals<T>): StyleList => tag.values ? tag.values : []

const simplyShow = <T extends Record<string, unknown>, V extends StyleList>(stylizer: Stylizer, _shuffler: Eval<T, V | void>) => listStylize(stylizer, justValues)

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

    const shuffler: Eval<T, V> = sequence(contexter as any, sortInStrategy) as Eval<T, V>

    const front = frontActive(activeStylizer, shuffler)
    const back = backActive(activeStylizer, shuffler)

    const trueContexter = listStylize(inactiveStylizer, contexter)

    const clozeRecipe = flashcardTemplate(frontInactive, backInactive)
    return clozeRecipe(tagname, front, back, trueContexter, ellipser, clozeSeparators)
}

export const mingleRecipes = generateFlashcardRecipes(oneSidedShufflePublicApi(listStylizeMaybe, listStylizeMaybe))
export const sortRecipes = generateFlashcardRecipes(oneSidedShufflePublicApi(listStylizeMaybe, simplyShow))
export const jumbleRecipes = generateFlashcardRecipes(oneSidedShufflePublicApi(simplyShow, listStylizeMaybe))
