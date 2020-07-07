import type { TagData, Recipe, Internals, Ellipser, InactiveBehavior, ActiveBehavior, WeakSeparator } from './types'
import type { FlashcardPreset, FlashcardTemplate } from './flashcardTemplate'
import type { SortInStrategy } from './sortInStrategies'

import { id, id2 } from './utils'
import { Stylizer } from './stylizer'
import { sequencer } from './sequencer'

import { makeFlashcardTemplate, choose, ellipsis } from './flashcardTemplate'
import { topUp } from './sortInStrategies'

const shuffleAndStylize = (sortIn: SortInStrategy): ActiveBehavior<FlashcardPreset, FlashcardPreset>  => (
    stylizer: Stylizer,
) => (tag: TagData, internals: Internals<FlashcardPreset>) => {
    const flattedValuesWithIndex = tag.values.flatMap((v: string[], i: number) => v.map((w: string) => [w, i]))

    const maybeValues = sequencer(
        `${tag.fullKey}:${tag.fullOccur}`,
        `${tag.fullKey}:${tag.fullOccur}`,
        flattedValuesWithIndex,
        sortIn,
        internals,
    )

    if (maybeValues) {
        return stylizer.stylize(
            maybeValues.map(v => v[0]),
            [maybeValues.map(v => v[1])],
        )
    }
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

const shuffleWithoutColors = (sortIn: (indices: number[], toLength: number) => number[]) => (tag: TagData, internals: Internals<FlashcardPreset>) => {
    const maybeValues = sequencer(
        `${tag.fullKey}:${tag.fullOccur}`,
        `${tag.fullKey}:${tag.fullOccur}`,
        tag.values[0],
        sortIn,
        internals,
    )

    if (maybeValues) {
        return maybeValues
    }
}

const multipleChoicePublicApi = (
    frontInactive: InactiveBehavior<FlashcardPreset, FlashcardPreset>,
    backInactive: InactiveBehavior<FlashcardPreset, FlashcardPreset>,
): Recipe<FlashcardPreset> => (options: {
    tagname?: string,

    frontStylizer?: Stylizer,
    backStylizer?: Stylizer,

    contexter?: Ellipser<FlashcardPreset, string[]>,
    ellipser?: Ellipser<FlashcardPreset, string[]>,

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

        contexter = shuffleWithoutColors(sortInStrategy),
        ellipser = ellipsis,

        flashcardTemplate = makeFlashcardTemplate(),
    } = options

    const multipleChoiceSeparators = { separators: [categorySeparator, valueSeparator] }
    const shuffleAndStylizeWithStrategy = shuffleAndStylize(sortInStrategy)

    const multipleChoiceRecipe = flashcardTemplate(frontInactive, backInactive)(shuffleAndStylizeWithStrategy, shuffleAndStylizeWithStrategy, multipleChoiceSeparators)

    return multipleChoiceRecipe({
        tagname: tagname,

        inactiveStylizer: inactive,
        contexter: contexter,
        inactiveEllipser: ellipser,

        frontStylizer: frontStylizer,
        backStylizer: backStylizer,
        activeEllipser: ellipser /* never used in standard settings */,
    })
}

export const multipleChoiceShowRecipe = multipleChoicePublicApi(choose(id), choose(id))
export const multipleChoiceHideRecipe = multipleChoicePublicApi(choose(id2), choose(id2))
export const multipleChoiceRevealRecipe = multipleChoicePublicApi(choose(id2), choose(id))
