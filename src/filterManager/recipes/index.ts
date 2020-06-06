import { shufflingRecipe } from './shuffling'
import { orderingRecipe } from './ordering'
import { clozeShowRecipe, clozeHideRecipe } from './clozes'
import { multipleChoiceShowRecipe, multipleChoiceHideRecipe } from './multipleChoice'
import { randRecipe } from './rand'
import { styleRecipe } from './stylizing'

import { debugRecipe } from './debug'
import { metaRecipe } from './meta'

export const recipes = {
    shuffling: shufflingRecipe,
    ordering: orderingRecipe,
    clozeShow: clozeShowRecipe,
    clozeHide: clozeHideRecipe,
    random: randRecipe,
    multipleChoiceShow: multipleChoiceShowRecipe,
    multipleChoiceHide: multipleChoiceHideRecipe,
    debug: debugRecipe,
    meta: metaRecipe,
    stylizing: styleRecipe,
}
