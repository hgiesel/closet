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

const sign = choice([
    str('+'),
    str('-'),
])

const integer = many1(digit).map(joiner)

const positiveReal = sequenceOf([
    integer,
    possibly(sequenceOf([
        str('.'),
        integer,
    ]).map(joiner))
]).map(joiner)

export const parseNumber =
    sequenceOf([
        possibly(sign),
        positiveReal,
    ]).map(joiner).map(mkNumber)

//////////// SYMBOLS

import {
    mkSymbol,
} from '../constructors'


// http://www.lispworks.com/documentation/HyperSpec/Body/02_ac.htm
const lispChars = anyOfString('_-~./!?+<=>*%@$\|^')
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
