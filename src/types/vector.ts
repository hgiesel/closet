import {
    sepBy1,
} from 'arcsecond'

import {
    Slang,
    SlangTypes,
} from './types'

import {
    bracketed,
} from './utils'

import {
    parseItem,
} from './item'

export interface SlangVector {
    kind: SlangTypes.Vector
    members: Slang[],
}

export const mkList = (members: Slang[]): SlangVector => ({
    kind: SlangTypes.Vector,
    members: members,
})


export const parseList = (bracketed (sepBy1(ws)(parseItem))
).map(mkList)
