import type { TagData, Recipe, Internals, Ellipser, InactiveBehavior, ActiveBehavior, WeakSeparator } from './types'
import type { FlashcardPreset, FlashcardTemplate } from './flashcardTemplate'
import type { SortInStrategy } from './sortInStrategies'

import { id, id2 } from './utils'
import { Stylizer } from './stylizer'
import { sequencer } from './sequencer'
import { noneEllipser } from './ellipser'

import { makeFlashcardTemplate } from './flashcardTemplate'
import { topUp } from './sortInStrategies'

const activeBehavior= (sortIn: SortInStrategy): ActiveBehavior<FlashcardPreset, FlashcardPreset>  => (
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

const defaultFrontStylizer = new Stylizer({
    separator: ', ',
    mapper: (v: string) => {
        return `<span style="color: orange;">${v}</span>`
    },
    processor: (v: string) => `( ${v} )`,
})

const defaultBackStylizer = defaultFrontStylizer.toStylizer({
    mapper: (v: string, _i, t: number) => {
        return `<span style="color: ${t === 0 ? 'lime' : 'red'};">${v}</span>`
    },
})
const defaultContexter = (sortIn: (indices: number[], toLength: number) => number[]) => (tag: TagData, internals: Internals<FlashcardPreset>) => {
    const maybeValues = sequencer(
        `${tag.fullKey}:${tag.fullOccur}`,
        `${tag.fullKey}:${tag.fullOccur}`,
        tag.values[0],
        sortIn,
        internals,
    )

    if (maybeValues) {
        const stylizer = new Stylizer()
        return stylizer.stylize(maybeValues)
    }
}

const multipleChoicePublicApi = (
    frontInactive: InactiveBehavior<FlashcardPreset, FlashcardPreset>,
    backInactive: InactiveBehavior<FlashcardPreset, FlashcardPreset>,
): Recipe<FlashcardPreset> => (options: {
    tagname?: string,

    frontStylizer?: Stylizer,
    backStylizer?: Stylizer,

    sortInStrategy?: SortInStrategy,
    outerSeparator?: WeakSeparator,
    innerSeparator?: WeakSeparator,

    contexter?: Ellipser<FlashcardPreset>,
    ellipser?: Ellipser<FlashcardPreset>,

    flashcardTemplate?: FlashcardTemplate,
} = {})  => {
    const {
        tagname = 'mc',

        frontStylizer = defaultFrontStylizer,
        backStylizer = defaultBackStylizer,

        sortInStrategy = topUp,
        outerSeparator = { sep: '::' },
        innerSeparator = { sep: '||' },

        contexter = defaultContexter(sortInStrategy),
        ellipser = noneEllipser,

        flashcardTemplate = makeFlashcardTemplate(),
    } = options

    const multipleChoiceSeparators = { separators: [outerSeparator, innerSeparator] }
    const theActiveBehavior = activeBehavior(sortInStrategy)

    const multipleChoiceRecipe = flashcardTemplate(frontInactive, backInactive)(theActiveBehavior, theActiveBehavior, multipleChoiceSeparators)

    return multipleChoiceRecipe({
        tagname: tagname,

        frontStylizer: frontStylizer,
        backStylizer: backStylizer,

        contexter: contexter,
        activeEllipser: ellipser,
        inactiveEllipser: ellipser,
    })
}

export const multipleChoiceShowRecipe = multipleChoicePublicApi(id, id)
export const multipleChoiceHideRecipe = multipleChoicePublicApi(id2, id2)
export const multipleChoiceRevealRecipe = multipleChoicePublicApi(id2, id)
