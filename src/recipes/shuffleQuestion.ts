import type { TagData, Internals, Ellipser, WeakSeparator, Recipe, InactiveBehavior, ActiveBehavior } from './types'
import type { FlashcardTemplate, FlashcardPreset } from './flashcardTemplate'
import type { SortInStrategy } from './sortInStrategies'

import { makeFlashcardTemplate, choose, ellipsis } from './flashcardTemplate'

import { Stylizer } from './stylizer'
import { sequencer } from './sequencer'
import { fullKeyEllipser, uidEllipser } from './ellipser'
import { topUp } from './sortInStrategies'

import { id, id2 } from './utils'

const shuffleAndStylize = (sortIn: SortInStrategy) => (getKey: Ellipser<{}, string>): ActiveBehavior<FlashcardPreset, FlashcardPreset>  => (
    stylizer: Stylizer,
) => (tag: TagData, internals: Internals<FlashcardPreset>) => {

    const maybeValues = sequencer(
        uidEllipser(tag, internals),
        getKey(tag, internals),
        tag.values,
        sortIn,
        internals,
    )

    if (maybeValues) {
        return stylizer.stylize(maybeValues)
    }
}

const inactive: Stylizer = new Stylizer({
    separator: ', ',
})

const blueHighlight: Stylizer = new Stylizer({
    processor: v => `<span style="color: cornflowerblue;">${v}</span>`,
})

const valuesInOrder: Ellipser<FlashcardPreset, string[]> = (tag: TagData) => tag.values

const shuffleQuestPublicApi = (
    frontInactive: InactiveBehavior<FlashcardPreset, FlashcardPreset>,
    backInactive: InactiveBehavior<FlashcardPreset, FlashcardPreset>,
): Recipe<FlashcardPreset> => (options: {
    tagname?: string,

    contexter?: Ellipser<FlashcardPreset, string[]>,
    ellipser?: Ellipser<FlashcardPreset, string[]>,

    activeStylizer?: Stylizer,

    sortInStrategy?: SortInStrategy,
    separator?: WeakSeparator,
    flashcardTemplate?: FlashcardTemplate,
} = {}) => {
    const {
        tagname = 'c',

        sortInStrategy = topUp,

        contexter = valuesInOrder,
        ellipser = ellipsis,

        activeStylizer = blueHighlight,

        separator = { sep: '::' },
        flashcardTemplate = makeFlashcardTemplate(),
    } = options

    const clozeSeparators = { separators: [separator] }
    const shuffleAndStylizeWithStrategy = shuffleAndStylize(sortInStrategy)

    const clozeRecipe = flashcardTemplate(frontInactive, backInactive)(shuffleAndStylizeWithStrategy(fullKeyEllipser), shuffleAndStylizeWithStrategy(uidEllipser), clozeSeparators)

    return clozeRecipe({
        tagname: tagname,

        inactiveStylizer: inactive,
        contexter: contexter,
        inactiveEllipser: ellipser,

        frontStylizer: activeStylizer,
        backStylizer: activeStylizer,
        activeEllipser: ellipser /* never used in standard settings */,
    })
}

export const shuffleShowRecipe = shuffleQuestPublicApi(choose(id), choose(id))
export const shuffleHideRecipe = shuffleQuestPublicApi(choose(id2), choose(id2))
export const shuffleRevealRecipe = shuffleQuestPublicApi(choose(id2), choose(id))
