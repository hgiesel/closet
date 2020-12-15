import type { Recipes } from '..'

import { appendStyleTag } from './utils'
import { occlusionMakerRecipe } from './occlusionEditor'
import { rectRecipes } from './rect'

const recipes: Recipes = {
    occlusionEditor: occlusionMakerRecipe,
    rect: rectRecipes,
}

export const browser = {
    appendStyleTag: appendStyleTag,
    recipes: recipes,
}
