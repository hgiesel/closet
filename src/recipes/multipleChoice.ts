import type { TagData, Recipe, Eval, Internals, InactiveBehavior, WeakFilter, WeakFilterResult, WeakSeparator } from './types'
import type { FlashcardPreset, FlashcardTemplate } from './flashcardTemplate'
import type { SortInStrategy } from './sortInStrategies'

import { Stylizer } from './stylizer'
import { withinTag, acrossTag } from './sequencer'
import { makeFlashcardTemplate, generateFlashcardRecipes, toListStylize, ellipsis } from './flashcardTemplate'
import { topUp } from './sortInStrategies'

type ValuePlusCategory = [string, number]

const flattedValuesWithIndex = <T extends {}>(
    tag: TagData,
    _internals: Internals<T>,
): ValuePlusCategory[] => {
    const flattedValuesWithIndex: ValuePlusCategory[] = tag
        .values
        .flatMap((v: string[], i: number) => v.map((w: string) => [w, i]))

    return flattedValuesWithIndex
}

const firstCategory = <T extends {}>(tag: TagData, _internals: Internals<T>): string[] => tag.values[0]

const shuffleAndStylize = <T extends {}, V extends [...any[]]>(
    stylizer: Stylizer,
    ellipser: Eval<T, V[] | void>,
): WeakFilter<T> => (tag: TagData, internals: Internals<T>): WeakFilterResult => {
    const maybeValues = ellipser(tag, internals)

    return maybeValues
        ? stylizer.stylize(
            maybeValues.map((v: V) => v[0]),
            [maybeValues.map((v: V) => v[1])],
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
): Recipe<T> => <V extends [...any[]]>(options: {
    tagname?: string,

    frontStylizer?: Stylizer,
    backStylizer?: Stylizer,

    inactiveStylizer?: Stylizer,
    contexter?: Eval<T, string[]>,
    ellipser?: WeakFilter<T>,

    getValues?: Eval<T, V[]>,
    sequence?: (getValues: Eval<T, V[]>, sortIn: SortInStrategy) => Eval<T, V[] | void>

    sortInStrategy?: SortInStrategy,
    categorySeparator?: WeakSeparator,
    valueSeparator?: WeakSeparator,

    flashcardTemplate?: FlashcardTemplate<T>,
} = {})  => {
    const {
        tagname = 'mc',

        frontStylizer = orangeCommaSeparated,
        backStylizer = greenAndRed,

        inactiveStylizer = inactive,
        contexter = firstCategory,
        ellipser = ellipsis,

        getValues = flattedValuesWithIndex,
        sequence = withinTag,

        sortInStrategy = topUp,
        categorySeparator = { sep: '::' },
        valueSeparator = { sep: '||' },

        flashcardTemplate = makeFlashcardTemplate(),
    } = options

    const inTagShuffleWithStrategy: Eval<T, V[] | void> = sequence(getValues as any, sortInStrategy) as Eval<T, V[]>

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
