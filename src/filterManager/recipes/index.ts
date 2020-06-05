import { shufflingRecipe } from './shuffling'
import { orderingRecipe } from './ordering'
import { clozeShowRecipe, clozeHideRecipe } from './clozes'
import { mcRecipe } from './multipleChoice'
import { randRecipe } from './rand'
import { styleRecipe } from './stylizing'

import { debugRecipe } from './debug'
import { metaRecipe } from './meta'

export const recipes = {
    shuffling: shufflingRecipe,
    ordering: orderingRecipe,
    clozeHide: clozeHideRecipe,
    clozeShow: clozeShowRecipe,
    random: randRecipe,
    multipleChoice: mcRecipe,
    debug: debugRecipe,
    meta: metaRecipe,
    stylizing: styleRecipe,
}
