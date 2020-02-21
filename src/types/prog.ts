import {
    sepBy,
} from 'arcsecond'

import {
    SlangTypes,
    Slang,
} from './types'

import {
    ws,
} from './utils'

import {
    parseItem,
} from './item'

export interface SlangProg {
    kind: SlangTypes.Prog
    statements: Slang[]
}

export const mkProg = (xs: Slang[]): SlangProg => ({
    kind: SlangTypes.Prog,
    statements: xs,
})

export const parseProg = sepBy(ws)(parseItem)
    .map((xs: Slang[]) => mkProg(xs))
