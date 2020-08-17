import { appendStyleTag } from './utils'

export const browser = {
    appendStyleTag: appendStyleTag,
}

import { occlusionMakerRecipe } from './occlusionMaker'
import { rectShowRecipe, rectHideRecipe, rectRevealRecipe } from './rect'

export const browserRecipes = {
    makeOcclusions: occlusionMakerRecipe,
    rectShow: rectShowRecipe,
    rectHide: rectHideRecipe,
    rectReveal: rectRevealRecipe,
}
