import { appendStyleTag } from './utils'
import { wrapImage } from './mysvg'

export const browser = {
    appendStyleTag: appendStyleTag,
    wrapImage: wrapImage,
}

import { occlusionMakerRecipe } from './mysvg'
import { rectRecipe } from './rect'

export const browserRecipes = {
    makeOcclusions: occlusionMakerRecipe,
    rect: rectRecipe,
}
