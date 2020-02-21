import {
    optionalWhitespace
} from 'arcsecond'

import {
    parenthesized,
} from './utils'

import {
    SlangTypes,
} from './types'

export interface SlangUnit {
    kind: SlangTypes.Unit
}

export const mkUnit = (): SlangUnit => ({
    kind: SlangTypes.Unit,
})

export const parseUnit = parenthesized(optionalWhitespace)
    .map((_xs: string) => mkUnit())
