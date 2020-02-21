import type {
    Slang,
    SlangSeq,
    SlangMap,
    SlangVector,
    SlangNumber,
    SlangOptional,
} from '../types'

import {
    mkOptional,
} from '../constructors'

import {
    isString,
    isOptional,
    isVector,
    isMap,
} from '../reflection'


export const indexing = ([listArg, idx]: [SlangVector, SlangNumber]): SlangOptional => {
    return mkOptional(listArg.members[idx.value] ?? null)
}
