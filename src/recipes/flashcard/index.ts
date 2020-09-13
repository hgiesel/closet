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

export const cloze = prepareFlashcardRecipes(clozeRecipes as Triple<Recipe<FlashcardPreset>>)
export const multipleChoice = prepareFlashcardRecipes(multipleChoiceRecipes as Triple<Recipe<FlashcardPreset>>)
export const specification = prepareFlashcardRecipes(specRecipes as Triple<Recipe<FlashcardPreset>>)

export const mingle = prepareFlashcardRecipes(mingleRecipes as Triple<Recipe<FlashcardPreset>>)
export const sort = prepareFlashcardRecipes(sortRecipes as Triple<Recipe<FlashcardPreset>>)
export const jumble = prepareFlashcardRecipes(jumbleRecipes as Triple<Recipe<FlashcardPreset>>)
