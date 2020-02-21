import {
    between,
    str,
    many,
    choice,
    anythingExcept,
} from 'arcsecond'

import {
    SlangTypes,
} from './types'

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
