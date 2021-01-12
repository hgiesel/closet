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

//////////////////////////////////// WRAPPERS / DECIDERS / SEQUENCERS

export { wrappers } from './wrappers'
export * as deciders from './flashcard/deciders'

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
