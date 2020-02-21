import {
    recursiveParser,
    choice,
    takeRight,
    takeLeft,
    str,
    many,
    sequenceOf,
} from 'arcsecond'

import {
    parenthesized,
    bracketed,
    braced,
    sandwiched1,
    sandwiched,
    ws,
} from './utils'

import {
    Slang,
    SlangTypes,
} from '../types'

///////////////// RECURSIVE TOKEN

import {
    parseString,
    parseNumber,
    parseBool,
    parseUnit,

    parseSymbol,
    parseKeyword,
} from './basic'

export const parseToken = recursiveParser(() => choice([
    parseString,
    parseNumber,
    parseBool,
    parseUnit,

    parseSymbol,
    parseKeyword,

    parseQuoted,
    parseOptional,

    parseList,
    parseVector,
    parseMap,
]))

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

export const parseList = parenthesized(sandwiched1(ws)(parseToken))
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

export const parseVector = bracketed(sandwiched(ws)(parseToken))
    .map(mkVector)

///////////////// MAP

import {
    SlangString,
    SlangKeyword,
} from './basic'

export interface SlangMap {
    kind: SlangTypes.Map
    table: Map<string | Symbol, Slang>,
}

const mapMapKey = (v: SlangString | SlangKeyword) => {
    if (v.kind === SlangTypes.String) {
        return v.value
    }

    return Symbol.for(v.value)
}

export const mkMap = (vs: [SlangString | SlangKeyword, Slang][]): SlangMap => {
    const theMap: Map<string | Symbol, Slang> = new Map()

    for (const v of vs) {
        theMap.set(mapMapKey(v[0]), v[1])
    }

    return {
        kind: SlangTypes.Map,
        table: theMap,
    }
}

export const keyValues = takeRight(ws)(many(sequenceOf([
    takeLeft(choice([parseKeyword, parseString]))(ws),
    takeLeft(parseToken)(ws),
])))

export const parseMap = braced(keyValues)
    .map(mkMap)

///////////////// QUOTED

export interface SlangQuoted {
    kind: SlangTypes.Quoted,
    quoted: Slang,
}

export const mkQuoted = (x: Slang): SlangQuoted => ({
    kind: SlangTypes.Quoted,
    quoted: x,
})

export const parseQuoted = takeRight(str('\''))(parseToken)
    .map((x: Slang) => mkQuoted(x))

///////////////// OPTIONAL

export interface SlangOptional {
    kind: SlangTypes.Optional,
    boxed: Slang | null,
}

export const mkOptional = (x: Slang | null): SlangOptional => ({
    kind: SlangTypes.Optional,
    boxed: x,
})

export const parseOptional = choice([
    takeRight(str('&'))(parseToken),
    choice([str('#none'), str('#n')]).map((_v: string) => null),
]).map((x: Slang) => mkOptional(x))


///////////////// PROG

export interface SlangProg {
    kind: SlangTypes.Prog
    statements: Slang[]
}

export const mkProg = (xs: Slang[]): SlangProg => ({
    kind: SlangTypes.Prog,
    statements: xs,
})

export const parseProg = sandwiched(ws)(parseToken)
    .map((xs: Slang[]) => mkProg(xs))
