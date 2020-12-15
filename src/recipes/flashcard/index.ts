import type { Recipe } from '../types'
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

const flashcard = {
    cloze: clozeRecipes,
    multipleChoice: multipleChoiceRecipes,
    specification: specRecipes,

    mingle: mingleRecipes,
    sort: sortRecipes,
    jumble: jumbleRecipes,
}

export default flashcard
