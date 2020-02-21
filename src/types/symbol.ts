import {
    many1,
    letter,
    str,
    takeRight,
} from 'arcsecond'

import {
    SlangTypes,
} from './types'

//// Symbols

export interface SlangSymbol {
    kind: SlangTypes.Symbol
    value: string,
}

export const mkSymbol = (x: string): SlangSymbol => ({
    kind: SlangTypes.Symbol,
    value: x,
})

export const parseSymbol = many1(letter)
    .map((x: string[]) => mkSymbol(x.join('')))

//// Keywords

export interface SlangKeyword {
    kind: SlangTypes.Keyword
    value: string,
}

export const mkKeyword = (x: string): SlangKeyword => ({
    kind: SlangTypes.Keyword,
    value: x,
})

export const parseKeyword = takeRight(str(':'))(many1(letter))
    .map((x: string[]) => mkKeyword(x.join('')))
