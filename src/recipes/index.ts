import type { Recipe } from './types'

interface Recipes {
    [propName: string]: Recipe<any>;
}

import { shufflingRecipe } from './shuffling'
import { orderingRecipe } from './ordering'
import { clozeShowRecipe, clozeHideRecipe, clozeRevealRecipe } from './clozes'
import { multipleChoiceShowRecipe, multipleChoiceHideRecipe, multipleChoiceRevealRecipe } from './multipleChoice'
import { shuffleShowRecipe, shuffleHideRecipe, shuffleRevealRecipe, sortShowRecipe, sortHideRecipe, sortRevealRecipe, jumbleShowRecipe, jumbleHideRecipe, jumbleRevealRecipe } from './shuffleQuestion'
import { generateIntegerRecipe, generateRealRecipe } from './generator'

import { styleRecipe, processRecipe } from './stylizing'

import { debugRecipe } from './debug'
import { defRecipe } from './meta'
import { activateRecipe, deactivateRecipe } from './boolStore'
import { setNumberRecipe } from './numberStore'

export const recipes: Recipes = {
    shuffle: shufflingRecipe,
    order: orderingRecipe,

    shuffleShow: shuffleShowRecipe,
    shuffleHide: shuffleHideRecipe,
    shuffleReveal: shuffleRevealRecipe,

    sortShow: sortShowRecipe,
    sortHide: sortHideRecipe,
    sortReveal: sortRevealRecipe,

    jumbleShow: jumbleShowRecipe,
    jumbleHide: jumbleHideRecipe,
    jumbleReveal: jumbleRevealRecipe,

    generateInteger: generateIntegerRecipe,
    generateReal: generateRealRecipe,

    clozeShow: clozeShowRecipe,
    clozeHide: clozeHideRecipe,
    clozeReveal: clozeRevealRecipe,

    multipleChoiceShow: multipleChoiceShowRecipe,
    multipleChoiceHide: multipleChoiceHideRecipe,
    multipleChoiceReveal: multipleChoiceRevealRecipe,

    process: processRecipe,
    stylize: styleRecipe,

    activate: activateRecipe,
    deactivate: deactivateRecipe,

    setNumber: setNumberRecipe,

    debug: debugRecipe,
    meta: defRecipe,
}

////////////////////////////////////

import { wrap, wrapWithDeferred, wrapWithAftermath } from './wrappers'
import { sum, sumFour } from './sum'
import { product } from './product'

export const wrappers = {
    wrap: wrap,

    deferred: wrapWithDeferred,
    aftermath: wrapWithAftermath,

    sum: sum,
    sumFour: sumFour,

    product: product,
}

////////////////////////////////////

export * as deciders from './deciders'

////////////////////////////////////

import { withinTag, acrossTag } from './sequencer'

export const sequencers = {
    withinTag: withinTag,
    acrossTag: acrossTag,
}
