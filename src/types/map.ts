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

export const parseUnit = takeRight (str('#')) (choice([
    str('t'),
    str('true'),
    str('f'),
    str('false'),
]).map((_xs: string) => mkBool())
