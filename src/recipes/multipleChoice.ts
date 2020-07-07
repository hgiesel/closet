import type { TagData, Recipe, Eval, Internals, InactiveBehavior, WeakFilter, WeakFilterResult, WeakSeparator } from './types'
import type { FlashcardPreset, FlashcardTemplate } from './flashcardTemplate'
import type { SortInStrategy } from './sortInStrategies'

import { Stylizer } from './stylizer'
import { sequencer } from './sequencer'
import { makeFlashcardTemplate, generateFlashcardRecipes, ellipsis } from './flashcardTemplate'
import { topUp } from './sortInStrategies'

type ValuePlusCategory = [string, number]

const inTagShuffle = (sortIn: SortInStrategy): Eval<{}, ValuePlusCategory[] | void> => (
    tag: TagData,
    internals: Internals<{}>,
): [string, number][] | void => {
    const flattedValuesWithIndex: [string, number][] = tag.values
        .flatMap((v: string[], i: number) => v.map((w: string) => [w, i]))

    const uid = `${tag.fullKey}:${tag.fullOccur}`
    const maybeValues = sequencer(uid, uid, flattedValuesWithIndex, sortIn, internals)

    if (maybeValues) {
        return maybeValues
    }
}

const firstCategory: WeakFilter<{}> = (tag: TagData) => tag.values[0]

const shuffleAndStylize = (
    stylizer: Stylizer,
    ellipser: Eval<{}, ValuePlusCategory[] | void>,
): WeakFilter<{}> => (tag: TagData, internals: Internals<FlashcardPreset>): WeakFilterResult => {
    const maybeValues = ellipser(tag, internals)

    return maybeValues
        ? stylizer.stylize(
            maybeValues.map((v: ValuePlusCategory) => v[0]),
            [maybeValues.map((v: ValuePlusCategory) => v[1])],
        )
        : { ready: false }
}

const orangeCommaSeparated = new Stylizer({
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

const multipleChoicePublicApi = (
    frontInactive: InactiveBehavior<FlashcardPreset, FlashcardPreset>,
    backInactive: InactiveBehavior<FlashcardPreset, FlashcardPreset>,
): Recipe<FlashcardPreset> => (options: {
    tagname?: string,

    frontStylizer?: Stylizer,
    backStylizer?: Stylizer,

    contexter?: WeakFilter<FlashcardPreset>,
    ellipser?: WeakFilter<FlashcardPreset>,

    sortInStrategy?: SortInStrategy,
    categorySeparator?: WeakSeparator,
    valueSeparator?: WeakSeparator,

    flashcardTemplate?: FlashcardTemplate,
} = {})  => {
    const {
        tagname = 'mc',

        frontStylizer = orangeCommaSeparated,
        backStylizer = greenAndRed,

        sortInStrategy = topUp,
        categorySeparator = { sep: '::' },
        valueSeparator = { sep: '||' },

        contexter = firstCategory,
        ellipser = ellipsis,

        flashcardTemplate = makeFlashcardTemplate(),
    } = options

    const inTagShuffleWithStrategy = inTagShuffle(sortInStrategy)

    const front = shuffleAndStylize(frontStylizer, inTagShuffleWithStrategy)
    const back = shuffleAndStylize(backStylizer, inTagShuffleWithStrategy)

    const multipleChoiceSeparators = { separators: [categorySeparator, valueSeparator] }
    const multipleChoiceRecipe = flashcardTemplate(frontInactive, backInactive)

    return multipleChoiceRecipe(tagname, front, back, contexter, ellipser, multipleChoiceSeparators)
}

export const [
    multipleChoiceShowRecipe,
    multipleChoiceHideRecipe,
    multipleChoiceRevealRecipe,
] = generateFlashcardRecipes(multipleChoicePublicApi)
