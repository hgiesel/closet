import type { Recipe, Triple } from '../types'
import type { FlashcardPreset } from './flashcardTemplate'

import { clozeRecipes } from './clozes'
import { multipleChoiceRecipes } from './multipleChoice'
import { specRecipes } from './spec'

import {
    mingleRecipes,
    sortRecipes,
    jumbleRecipes,
} from './shuffleQuestion'


export type { FlashcardPreset } from './flashcardTemplate'

export interface FlashcardRecipes {
    show: Recipe<FlashcardPreset>
    hide: Recipe<FlashcardPreset>
    reveal: Recipe<FlashcardPreset>
}

export const prepareFlashcardRecipes = ([show, hide, reveal]: Triple<Recipe<FlashcardPreset>>): FlashcardRecipes => ({
    show: show,
    hide: hide,
    reveal: reveal,
})

const flashcard = {
    cloze: prepareFlashcardRecipes(clozeRecipes as Triple<Recipe<FlashcardPreset>>),
    multipleChoice: prepareFlashcardRecipes(multipleChoiceRecipes as Triple<Recipe<FlashcardPreset>>),
    specification: prepareFlashcardRecipes(specRecipes as Triple<Recipe<FlashcardPreset>>),

    mingle: prepareFlashcardRecipes(mingleRecipes as Triple<Recipe<FlashcardPreset>>),
    sort: prepareFlashcardRecipes(sortRecipes as Triple<Recipe<FlashcardPreset>>),
    jumble: prepareFlashcardRecipes(jumbleRecipes as Triple<Recipe<FlashcardPreset>>),
}

export default flashcard
