import { appendStyleTag } from './utils'
import { wrapImage } from './mysvg'

export const browser = {
    appendStyleTag: appendStyleTag,
    wrapImage: wrapImage,
}

import { occlusionMakerRecipe } from './mysvg'
import { rectShowRecipe, rectHideRecipe, rectRevealRecipe } from './rect'

export const browserRecipes = {
    makeOcclusions: occlusionMakerRecipe,
    rectShow: rectShowRecipe,
    rectHide: rectHideRecipe,
    rectReveal: rectRevealRecipe,
}
