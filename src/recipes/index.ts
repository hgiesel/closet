import type { Recipe } from './types'
import type { FlashcardRecipes } from './flashcard'

export interface Recipes {
    [propName: string]: Recipe<any> | FlashcardRecipes
}

import { shufflingRecipe } from './shuffling'
import { orderingRecipe } from './ordering'
import { generateIntegerRecipe, generateRealRecipe } from './generator'
import { styleRecipe, processRecipe } from './stylizing'

import {
    activateRecipe,
    deactivateRecipe,
    setNumberRecipe,
} from './preferenceStore'

import {
    setListRecipe,
} from './sharedStore'

import { debugRecipe } from './debug'
import { defRecipe } from './meta'

import {
    cloze,
    multipleChoice,
    mingle,
    sort,
    jumble,
} from './flashcard'

export const recipes: Recipes = {
    shuffle: shufflingRecipe,
    order: orderingRecipe,

    generateInteger: generateIntegerRecipe,
    generateReal: generateRealRecipe,

    process: processRecipe,
    stylize: styleRecipe,

    activate: activateRecipe,
    deactivate: deactivateRecipe,
    setNumber: setNumberRecipe,

    setList: setListRecipe,

    debug: debugRecipe,
    meta: defRecipe,

    cloze: cloze,
    multipleChoice: multipleChoice,

    mingle: mingle,
    sort: sort,
    jumble: jumble,
}

////////////////////////////////////

export * as deciders from './flashcard/deciders'

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

import { withinTag, acrossTag } from './sequencer'

export const sequencers = {
    withinTag: withinTag,
    acrossTag: acrossTag,
}
