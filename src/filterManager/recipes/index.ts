import { shufflingRecipe } from './shuffling'
import { orderingRecipe } from './ordering'
import { clozeShowRecipe, clozeHideRecipe } from './clozes'
import { multipleChoiceShowRecipe, multipleChoiceHideRecipe } from './multipleChoice'
import { randRecipe } from './rand'
import { styleRecipe } from './stylizing'

import { debugRecipe } from './debug'
import { metaRecipe } from './meta'
import { activateRecipe, deactivateRecipe, toggleRecipe } from './activate'

import { wrapWithDeferred, wrapWithAftermath } from './wrappers'

export const recipes = {
    shuffling: shufflingRecipe,
    ordering: orderingRecipe,
    clozeShow: clozeShowRecipe,
    clozeHide: clozeHideRecipe,
    random: randRecipe,
    multipleChoiceShow: multipleChoiceShowRecipe,
    multipleChoiceHide: multipleChoiceHideRecipe,

    stylizing: styleRecipe,

    activate: activateRecipe,
    deactivate: deactivateRecipe,
    toggle: toggleRecipe,


    debug: debugRecipe,
    meta: metaRecipe,
}

export const wrappers = {
    deferred: wrapWithDeferred,
    aftermath: wrapWithAftermath,
}
