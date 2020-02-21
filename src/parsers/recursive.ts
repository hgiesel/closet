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

import {
    mkList,
} from '../constructors'

export const parseList = parenthesized(sandwiched1(ws)(parseToken))
    .map((xs: Slang[]) => mkList(xs[0], xs.slice(1)))

///////////////// VECTOR

import {
    mkVector,
} from '../constructors'

export const parseVector = bracketed(sandwiched(ws)(parseToken))
    .map(mkVector)

///////////////// MAP

import {
    mkMap,
} from '../constructors'

export const keyValues = takeRight(ws)(many(sequenceOf([
    takeLeft(choice([parseKeyword, parseString]))(ws),
    takeLeft(parseToken)(ws),
])))

export const parseMap = braced(keyValues)
    .map(mkMap)

///////////////// QUOTED

import {
    mkQuoted,
} from '../constructors'

export const parseQuoted = takeRight(str('\''))(parseToken)
    .map((x: Slang) => mkQuoted(x))

///////////////// OPTIONAL

import {
    mkOptional,
} from '../constructors'

export const parseOptional = choice([
    takeRight(str('&'))(parseToken),
    choice([str('#none'), str('#n')]).map((_v: string) => null),
]).map((x: Slang) => mkOptional(x))

///////////////// PROG

import {
    mkProg,
} from '../constructors'

export const parseProg = sandwiched(ws)(parseToken)
    .map((xs: Slang[]) => mkProg(xs))
