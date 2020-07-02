import type { Recipe } from './types'

interface Recipes {
    [propName: string]: Recipe<any>;
}

import { shufflingRecipe } from './shuffling'
import { orderingRecipe } from './ordering'
import { clozeShowRecipe, clozeHideRecipe, clozeRevealRecipe } from './clozes'
import { multipleChoiceShowRecipe, multipleChoiceHideRecipe, multipleChoiceRevealRecipe } from './multipleChoice'
// import { randRecipe } from './rand'
import { styleRecipe, processRecipe } from './stylizing'

import { debugRecipe } from './debug'
import { defRecipe } from './meta'
import { activateRecipe, deactivateRecipe, toggleRecipe } from './boolStore'
import { setNumberRecipe, incrementRecipe, decrementRecipe } from './numberStore'

export const recipes: Recipes = {
    shuffling: shufflingRecipe,
    ordering: orderingRecipe,

    clozeShow: clozeShowRecipe,
    clozeHide: clozeHideRecipe,
    clozeReveal: clozeRevealRecipe,

    multipleChoiceShow: multipleChoiceShowRecipe,
    multipleChoiceHide: multipleChoiceHideRecipe,
    multipleChoiceReveal: multipleChoiceRevealRecipe,

    stylizing: styleRecipe,
    processing: processRecipe,

    activate: activateRecipe,
    deactivate: deactivateRecipe,
    toggle: toggleRecipe,

    setNumber: setNumberRecipe,
    increment: incrementRecipe,
    decrement: decrementRecipe,

    debug: debugRecipe,
    meta: defRecipe,
}

////////////////////////////////////

import { wrap, wrapWithDeferred, wrapWithAftermath } from './wrappers'
import { twoWayWrap, fourWayWrap } from './nway'
import { product } from './product'

export const wrappers = {
    wrap: wrap,

    deferred: wrapWithDeferred,
    aftermath: wrapWithAftermath,

    twoWay: twoWayWrap,
    fourWay: fourWayWrap,

    product: product,
}

////////////////////////////////////

export * as deciders from './deciders'
