import {
    sepBy1,
} from 'arcsecond'

import {
    Slang,
    SlangTypes,
} from './types'

import {
    parenthesized,
    ws,
} from './utils'

import {
    parseItem,
} from './item'

export interface SlangList {
    kind: SlangTypes.List
    head: Slang,
    tail: Slang[],
}

export const mkList = (head: Slang, tail: Slang[]): SlangList => ({
    kind: SlangTypes.List,
    head: head,
    tail: tail,
})


export const parseList = (parenthesized (sepBy1(ws)(parseItem))
).map((xs: Slang[]) => mkList(xs[0], xs.slice(1)))
