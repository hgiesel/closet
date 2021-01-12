import { appendStyleTag } from './utils'
import { occlusionMakerRecipe } from './occlusionEditor'
import { rectRecipes } from './rect'


const recipes = {
    occlusionEditor: occlusionMakerRecipe,
    rect: rectRecipes,
}

const browser = {
    appendStyleTag: appendStyleTag,
    recipes: recipes,
}

export default browser
