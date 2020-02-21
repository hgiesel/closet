import {
    between,
    str,
    choice,
    regex,
    whitespace,
    many,
} from 'arcsecond'

const wsChars = choice([
    whitespace,
    str(','),
    regex(/^<[^>]*>/u),
    str('&nbsp;'),
])

export const ws = many(wsChars)

export const parenthesized = between (str('(')) (str(')'))
export const bracketed = between (str('[')) (str(']'))
export const braced = between (str('{')) (str('}'))

export const joiner = (vs: string[]) => vs.join('')
