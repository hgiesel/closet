import type { Recipe } from './types'

export interface Recipes {
    [propName: string]: Recipe<any>
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

//////////////////////////////////// WRAPPERS

import { wrap, wrapWithDeferred, wrapWithAftermath } from './wrappers'
import { sum, sumFour } from './sum'
import { product } from './product'
import { collection } from './collection'

export const wrappers = {
    wrap,

    deferred: wrapWithDeferred,
    aftermath: wrapWithAftermath,

    sum,
    sumFour,

    product,
    collection,
}

//////////////////////////////////// SEQUENCERS

import { withinTag, acrossTag } from './sequencer'

export const sequencers = {
    withinTag: withinTag,
    acrossTag: acrossTag,
}

//////////////////////////////////// PATTERNS

import {
    keyPattern,
    keySeparationPattern,
    unicodeLetterPattern,
    unicodeNumberPattern,
    unicodeAlphanumericPattern,
} from './patterns'

export const patterns = {
    key: keyPattern,
    keySeparation: keySeparationPattern,
    unicodeLetter: unicodeLetterPattern,
    unicodeNumber: unicodeNumberPattern,
    unicodeAlphanumeric: unicodeAlphanumericPattern,
}
