import {
    between,
    str,
    choice,
    regex,
    whitespace,
    many,
    many1,
    takeRight,
    takeLeft,
} from 'arcsecond'

const wsChars = choice([
    whitespace,
    str(','),
    regex(/^<[^>]*>/u),
    str('&nbsp;'),
])

// lists, units, vectors, strings, maps do not need separators
export const ws = many(wsChars)
export const betweenWs = between(ws)(ws)

export const sandwiched = (sep) => (parser) => takeRight(sep)(many1(takeLeft(parser)(sep)))
export const sandwiched1 = (sep) => (parser) => takeRight(sep)(many(takeLeft(parser)(sep)))

export const parenthesized = between (str('(')) (str(')'))
export const bracketed = between (str('[')) (str(']'))
export const braced = between (str('{')) (str('}'))

export const joiner = (vs: string[]) => vs.join('')
