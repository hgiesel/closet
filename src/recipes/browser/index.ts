import type { Recipes } from '..'
import type { Triple, Recipe } from '../types'
import type { FlashcardPreset } from '../flashcard/flashcardTemplate'

import { prepareFlashcardRecipes } from '../flashcard'
import { appendStyleTag } from './utils'
import { occlusionMakerRecipe } from './occlusionMaker'
import { rectRecipes } from './rect'

const recipes: Recipes = {
    makeOcclusions: occlusionMakerRecipe,
    rect: prepareFlashcardRecipes(rectRecipes as Triple<Recipe<FlashcardPreset>>),
}

export const browser = {
    appendStyleTag: appendStyleTag,
    recipes: recipes,
}
