import type { Recipe } from './types'
import type { FlashcardRecipes } from './flashcard'

export interface Recipes {
    [propName: string]: Recipe<any> | FlashcardRecipes
}

import shuffling from './shuffling'
import ordering from './ordering'
import generating from './generating'
import stylizing from './stylizing'
import preferenceStore from './preferenceStore'
import sharedStore from './sharedStore'
import flashcard from './flashcard'

import { debugRecipe } from './debug'
import { defRecipe } from './meta'

export const recipes: Recipes = {
    ...shuffling,
    ...ordering,
    ...generating,
    ...stylizing,
    ...preferenceStore,
    ...sharedStore,
    ...flashcard,

    debug: debugRecipe,
    define: defRecipe,
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
