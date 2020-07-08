import { appendStyleTag } from './utils'
import { wrapImage } from './mysvg'

export const browser = {
    appendStyleTag: appendStyleTag,
    wrapImage: wrapImage,
}

import { occlusionMakerRecipe, rectRecipe } from './mysvg'

export const browserRecipes = {
    makeOcclusions: occlusionMakerRecipe,
    rect: rectRecipe,
}
