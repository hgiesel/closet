import { default as shuffling } from './shuffling'
import { default as ordering } from './ordering'
import { default as generating } from './generating'
import { default as stylizing } from './stylizing'
import { default as preferenceStore } from './preferenceStore'
import { default as sharedStore } from './sharedStore'
import { default as simple } from './simple'
import { default as debug } from './debug'
import { default as meta } from './meta'


const recipes = {
    ...shuffling,
    ...ordering,
    ...generating,
    ...stylizing,
    ...preferenceStore,
    ...sharedStore,
    ...simple,
    ...debug,
    ...meta,
}

export default recipes
