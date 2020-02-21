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

import {
    SlangTypes,
} from '../types'

//////////// UNIT

export interface SlangUnit {
    kind: SlangTypes.Unit
}

export const mkUnit = (): SlangUnit => ({
    kind: SlangTypes.Unit,
})

export const parseUnit = parenthesized(optionalWhitespace)
    .map((_xs: string) => mkUnit())

//////////// BOOL

export interface SlangBool {
    kind: SlangTypes.Bool
    value: boolean,
}

export const mkBool = (v: string): SlangBool => ({
    kind: SlangTypes.Bool,
    value: v.startsWith('t')
})

export const parseBool = (takeRight(str('#'))(choice([
    str('true'),
    str('false'),
    str('t'),
    str('f'),
]))).map((x: string) => mkBool(x))

//////////// NUMBER

enum Sign {
    Positive,
    Negative,
}

export interface SlangNumber {
    kind: SlangTypes.Number
    sign: Sign,
    real: number,
    imaginary: number,
}

export const mkNumber = (sgn: Sign, re: number, im: number): SlangNumber => ({
    kind: SlangTypes.Number,
    sign: sgn,
    real: Number(re),
    imaginary: Number(im),
})

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

export const real = sequenceOf([
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

export interface SlangSymbol {
    kind: SlangTypes.Symbol
    value: string,
}

export const mkSymbol = (x: string): SlangSymbol => ({
    kind: SlangTypes.Symbol,
    value: x,
})

export const parseSymbol = identifier
    .map((x: string[]) => (console.log(x),mkSymbol(x.join(''))))

//////////// KEYWORDS

export interface SlangKeyword {
    kind: SlangTypes.Keyword
    value: string,
}

export const mkKeyword = (x: string): SlangKeyword => ({
    kind: SlangTypes.Keyword,
    value: x,
})

export const parseKeyword = takeRight(str(':'))(identifier)
    .map((x: string[]) => mkKeyword(x.join('')))

//////////// STRINGS

export interface SlangString {
    kind: SlangTypes.String
    value: string,
}

export const mkString = (x: string): SlangString => ({
    kind: SlangTypes.String,
    value: x,
})

const doubleQuoted = between (str('"'))(str('"'))

export const parseString = doubleQuoted(many(choice([
    str('\\"'),
    anythingExcept(str('"')),
]))).map((xs: string[]) => mkString(xs.join('')))
