import {
    takeRight,
    str,
} from 'arcsecond'

import {
    SlangTypes,
    Slang,
} from './types'

import {
    parseItem,
} from './item'

export interface SlangQuoted {
    kind: SlangTypes.Quoted,
    quoted: Slang,
}

export const mkQuoted = (x: Slang): SlangQuoted => ({
    kind: SlangTypes.Quoted,
    quoted: x,
})

export const parseQuoted = takeRight(str('\''))(parseItem)
    .map((x: Slang) => mkQuoted(x))
