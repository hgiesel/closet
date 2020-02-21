import {
    optionalWhitespace,
    many,
    many1,
    letter,
    digit,
    anyOfString,
    str,
    takeRight,
    choice,
    between,
    sequenceOf,
    possibly,
    anythingExcept,
} from 'arcsecond'

import {
    joiner,
    parenthesized,
} from './utils'

//////////// UNIT

import {
    mkUnit,
} from '../constructors'

export const parseUnit = parenthesized(optionalWhitespace)
    .map((_xs: string) => mkUnit())

//////////// BOOL

import {
    mkBool,
} from '../constructors'

export const parseBool = (takeRight(str('#'))(choice([
    str('true'),
    str('false'),
    str('t'),
    str('f'),
]))).map((x: string) => mkBool(x.startsWith('t')))

//////////// NUMBER

import {
    mkNumber,
} from '../constructors'

import {
    Sign,
} from '../types'

const sign = choice([
    str('+'),
    str('-'),
])

const stringToSign = (str: string): Sign => {
    return str === '-'
        ? Sign.Negative
        : Sign.Positive
}

const integer = many1(digit).map(joiner)

const real = sequenceOf([
    integer,
    possibly(
        takeRight(str('.'))(integer)
    )
])

export const parseNumber = sequenceOf([
    possibly(sign),
    real,
    possibly(between(str('+'))(str('i'))(real)),
])
    .map((vs: [string | null, [string,string | null], [string,string | null] | null]) => mkNumber(
        stringToSign(vs[0]),
        Number(vs[1].join('.')),
        vs[2] ? Number(vs[2].join('.')) : 0,
    ))

//////////// SYMBOLS

import {
    mkSymbol,
} from '../constructors'


// http://www.lispworks.com/documentation/HyperSpec/Body/02_ac.htm
const lispChars = anyOfString('_-~./!?+<=>#*%@$\|^')
const firstChar = choice([
    letter,
    lispChars,
])
const restChars = many(choice([
    firstChar,
    digit,
])).map((v: string[]) => v.join(''))

const identifier = sequenceOf([firstChar, restChars])

export const parseSymbol = identifier
    .map((x: string[]) => (console.log(x),mkSymbol(x.join(''))))

//////////// KEYWORDS

import {
    mkKeyword,
} from '../constructors'

export const parseKeyword = takeRight(str(':'))(identifier)
    .map((x: string[]) => mkKeyword(x.join('')))

//////////// STRINGS

import {
    mkString,
} from '../constructors'

const doubleQuoted = between (str('"'))(str('"'))

export const parseString = doubleQuoted(many(choice([
    str('\\"'),
    anythingExcept(str('"')),
]))).map((xs: string[]) => mkString(xs.join('')))
