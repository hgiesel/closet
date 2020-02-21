import {
    Slang,
    SlangTypes,
} from './types'

import {
    recursiveParser,
    parenthesized,
    bracketed,
    sandwiched1,
    sandwiched,
    choice,
    takeRight,
    str,
    ws,
} from './utils'

///////////////// LIST

export interface SlangList {
    kind: SlangTypes.List
    head: Slang,
    tail: Slang[],
}

export const mkList = (head: Slang, tail: Slang[]): SlangList => ({
    kind: SlangTypes.List,
    head: head,
    tail: tail,
})

export const parseList = parenthesized(sandwiched1(ws)(recursiveToken))
    .map((xs: Slang[]) => mkList(xs[0], xs.slice(1)))

///////////////// VECTOR

export interface SlangVector {
    kind: SlangTypes.Vector
    members: Slang[],
}

export const mkVector = (members: Slang[]): SlangVector => ({
    kind: SlangTypes.Vector,
    members: members,
})

export const parseVector = bracketed(sandwiched(ws)(recursiveToken))
    .map(mkVector)

///////////////// MAP

export interface SlangMap {
    kind: SlangTypes.Map
    // value: boolean,
}

export const mkMap = (v: string): SlangMap => ({
    kind: SlangTypes.Map,
})

export const parseMap = null

///////////////// QUOTED

export interface SlangQuoted {
    kind: SlangTypes.Quoted,
    quoted: Slang,
}

export const mkQuoted = (x: Slang): SlangQuoted => ({
    kind: SlangTypes.Quoted,
    quoted: x,
})

export const parseQuoted = takeRight(str('\''))(recursiveToken)
    .map((x: Slang) => mkQuoted(x))

///////////////// OPTIONAL


///////////////// RECURSIVE TOKEN

import {
    // parseString,
    // parseNumber,
    // parseBool,
    // parseUnit,

    parseSymbol,
    // parseKeyword,
} from './parsers'

export const parseToken = choice([
    // parseString,
    // parseNumber,
    // parseBool,
    // parseUnit,

    parseSymbol,
    // parseKeyword,

    // parseQuoted,
    // parseOptional,

    parseList,
    // parseVector,
    // parseMap,
])

export const recursiveToken = recursiveParser(() => parseToken)

///////////////// PROG

export interface SlangProg {
    kind: SlangTypes.Prog
    statements: Slang[]
}

export const mkProg = (xs: Slang[]): SlangProg => ({
    kind: SlangTypes.Prog,
    statements: xs,
})

// export const parseProg = sepBy(ws)(parseItem)
export const parseProg = sandwiched(ws)(recursiveToken)
    .map((xs: Slang[]) => mkProg(xs))
