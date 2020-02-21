import type {
    SlangVector,
    SlangNumber,
    SlangOptional,
} from '../types'

import {
    mkOptional,
} from '../constructors'


export const indexing = ([listArg, idx]: [SlangVector, SlangNumber]): SlangOptional => {
    return mkOptional(listArg.members[idx.value] ?? null)
}
