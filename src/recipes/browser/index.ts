import { appendStyleTag } from './utils'
import { wrapImage } from './mysvg'

export const browser = {
    appendStyleTag: appendStyleTag,
    wrapImage: wrapImage,
}

import { occlusionMakerRecipe } from './mysvg'

export const browserRecipes = {
    makeOcclusions: occlusionMakerRecipe,
}
