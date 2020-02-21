import {
    takeRight,
    choice,
    str,
} from 'arcsecond'

import {
    SlangTypes,
} from './types'

export interface SlangBool {
    kind: SlangTypes.Bool
    value: boolean,
}

export const mkBool = (v: string): SlangBool => ({
    kind: SlangTypes.Bool,
    value: v.startsWith('t')
})

export const parseBool = (takeRight(str('#'))(choice([
    str('t'),
    str('true'),
    str('f'),
    str('false'),
]))).map((x: string) => mkBool(x))
