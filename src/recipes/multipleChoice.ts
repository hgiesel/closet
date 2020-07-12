import type { TagData, Recipe, Eval, Internals, InactiveBehavior, WeakFilter, WeakFilterResult, WeakSeparator } from './types'
import type { FlashcardPreset, FlashcardTemplate } from './flashcardTemplate'
import type { SortInStrategy } from './sortInStrategies'

import { Stylizer } from './stylizer'
import { sequencer } from './sequencer'
import { makeFlashcardTemplate, generateFlashcardRecipes, toListStylize, ellipsis } from './flashcardTemplate'
import { topUp } from './sortInStrategies'

type ValuePlusCategory = [string, number]

const inTagShuffle = (sortIn: SortInStrategy) => <T extends {}>(
    tag: TagData,
    internals: Internals<T>,
): [string, number][] | void => {
    const flattedValuesWithIndex: [string, number][] = tag.values
        .flatMap((v: string[], i: number) => v.map((w: string) => [w, i]))

    const uid = `${tag.fullKey}:${tag.fullOccur}`
    const maybeValues = sequencer(uid, uid, flattedValuesWithIndex, sortIn, internals)

    if (maybeValues) {
        return maybeValues
    }
}

const firstCategory = <T extends {}>(tag: TagData, _internals: Internals<T>) => tag.values[0]

const shuffleAndStylize = <T extends {}>(
    stylizer: Stylizer,
    ellipser: Eval<T, ValuePlusCategory[] | void>,
): WeakFilter<T> => (tag: TagData, internals: Internals<T>): WeakFilterResult => {
    const maybeValues = ellipser(tag, internals)

    return maybeValues
        ? stylizer.stylize(
            maybeValues.map((v: ValuePlusCategory) => v[0]),
            [maybeValues.map((v: ValuePlusCategory) => v[1])],
        )
        : { ready: false }
}

const inactive = new Stylizer()


const orangeCommaSeparated = inactive.toStylizer({
    processor: (v: string) => `( ${v} )`,
    mapper: (v: string) => {
        return `<span style="color: orange;">${v}</span>`
    },
})

const greenAndRed = orangeCommaSeparated.toStylizer({
    mapper: (v: string, _i, t: number) => {
        return `<span style="color: ${t === 0 ? 'lime' : 'red'};">${v}</span>`
    },
})

const multipleChoicePublicApi = <T extends FlashcardPreset>(
    frontInactive: InactiveBehavior<T>,
    backInactive: InactiveBehavior<T>,
): Recipe<T> => (options: {
    tagname?: string,

    frontStylizer?: Stylizer,
    backStylizer?: Stylizer,

    inactiveStylizer?: Stylizer,
    contexter?: Eval<T, string[]>,
    ellipser?: WeakFilter<T>,

    sortInStrategy?: SortInStrategy,
    categorySeparator?: WeakSeparator,
    valueSeparator?: WeakSeparator,

    flashcardTemplate?: FlashcardTemplate<T>,
} = {})  => {
    const {
        tagname = 'mc',

        frontStylizer = orangeCommaSeparated,
        backStylizer = greenAndRed,

        sortInStrategy = topUp,
        categorySeparator = { sep: '::' },
        valueSeparator = { sep: '||' },

        inactiveStylizer = inactive,
        contexter = firstCategory,
        ellipser = ellipsis,

        flashcardTemplate = makeFlashcardTemplate(),
    } = options

    const inTagShuffleWithStrategy = inTagShuffle(sortInStrategy) as Eval<T, [string, number][] | void>

    const front = shuffleAndStylize(frontStylizer, inTagShuffleWithStrategy)
    const back = shuffleAndStylize(backStylizer, inTagShuffleWithStrategy)

    const multipleChoiceSeparators = { separators: [categorySeparator, valueSeparator] }
    const multipleChoiceRecipe = flashcardTemplate(frontInactive, backInactive)

    const trueContexter = toListStylize(inactiveStylizer, contexter)

    return multipleChoiceRecipe(tagname, front, back, trueContexter, ellipser, multipleChoiceSeparators)
}

export const [
    multipleChoiceShowRecipe,
    multipleChoiceHideRecipe,
    multipleChoiceRevealRecipe,
] = generateFlashcardRecipes(multipleChoicePublicApi)
