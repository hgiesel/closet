import type { Recipe } from '../types'
import type { FlashcardPreset } from './flashcardTemplate'

export type { FlashcardPreset } from './flashcardTemplate'
export interface FlashcardRecipes {
    show: Recipe<FlashcardPreset>
    hide: Recipe<FlashcardPreset>
    reveal: Recipe<FlashcardPreset>
}


export * as deciders from './deciders'
export { FlashcardBehavior as behaviors } from './flashcardTemplate'

export { clozeRecipes as cloze } from './clozes'
export { multipleChoiceRecipes as multipleChoice } from './multipleChoice'
export { specRecipes as specification } from './spec'

export {
    mingleRecipes as mingle,
    sortRecipes as sort,
    jumbleRecipes as jumble,
} from './shuffleQuestion'
