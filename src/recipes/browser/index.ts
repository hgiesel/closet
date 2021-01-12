export { appendStyleTag } from './utils'

import { occlusionMakerRecipe } from './occlusionEditor'
import { rectRecipes } from './rect'


export const recipes = {
    occlusionEditor: occlusionMakerRecipe,
    rect: rectRecipes,
}
