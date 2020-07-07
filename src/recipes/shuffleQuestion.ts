import type { TagData, Internals, Ellipser, WeakSeparator, Recipe, InactiveBehavior, ActiveBehavior } from './types'
import type { FlashcardTemplate, FlashcardPreset } from './flashcardTemplate'
import type { SortInStrategy } from './sortInStrategies'

import { makeFlashcardTemplate } from './flashcardTemplate'

import { Stylizer } from './stylizer'
import { sequencer } from './sequencer'
import { noneEllipser, fullKeyEllipser, uidEllipser } from './ellipser'
import { topUp } from './sortInStrategies'

import { id, id2 } from './utils'

const shuffleAndStylize = (sortIn: SortInStrategy) => (getKey: Ellipser<{}>): ActiveBehavior<FlashcardPreset, FlashcardPreset>  => (
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

const blueHighlight: Stylizer = new Stylizer({
    processor: v => `<span style="color: cornflowerblue;">${v}</span>`,
})

const valuesInOrder: Ellipser<FlashcardPreset> = (tag: TagData) => {
    const stylizer = new Stylizer()
    return stylizer.stylize(tag.values)
}

const shuffleQuestPublicApi = (
    frontInactive: InactiveBehavior<FlashcardPreset, FlashcardPreset>,
    backInactive: InactiveBehavior<FlashcardPreset, FlashcardPreset>,
): Recipe<FlashcardPreset> => (options: {
    tagname?: string,

    contexter?: Ellipser<FlashcardPreset>,
    ellipser?: Ellipser<FlashcardPreset>,

    activeStylizer?: Stylizer,

    sortInStrategy?: SortInStrategy,
    separator?: WeakSeparator,
    flashcardTemplate?: FlashcardTemplate,
} = {}) => {
    const {
        tagname = 'c',

        sortInStrategy = topUp,

        contexter = valuesInOrder,
        ellipser = noneEllipser,

        activeStylizer = blueHighlight,

        separator = { sep: '::' },
        flashcardTemplate = makeFlashcardTemplate(),
    } = options

    const clozeSeparators = { separators: [separator] }
    const shuffleAndStylizeWithStrategy = shuffleAndStylize(sortInStrategy)

    const clozeRecipe = flashcardTemplate(frontInactive, backInactive)(shuffleAndStylizeWithStrategy(fullKeyEllipser), shuffleAndStylizeWithStrategy(uidEllipser), clozeSeparators)

    return clozeRecipe({
        tagname: tagname,

        contexter: contexter,
        inactiveEllipser: ellipser,

        frontStylizer: activeStylizer,
        backStylizer: activeStylizer,
        activeEllipser: ellipser /* never used in standard settings */,
    })
}

export const shuffleShowRecipe = shuffleQuestPublicApi(id, id)
export const shuffleHideRecipe = shuffleQuestPublicApi(id2, id2)
export const shuffleRevealRecipe = shuffleQuestPublicApi(id2, id)
