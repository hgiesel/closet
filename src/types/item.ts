import {
    recursiveParser,
    choice,
} from 'arcsecond'

import {
    parseString,
} from './string'

import {
    parseNumber,
} from './number'

import {
    parseBool,
} from './bool'

import {
    parseUnit,
} from './unit'

import {
    parseSymbol,
    parseKeyword,
} from './symbol'

import {
    parseList,
} from './list'

import {
    parseQuoted,
} from './quoted'

export const parseItem = recursiveParser(() => (choice([
    // parseString,
    parseNumber,
    // parseBool,
    // parseUnit,

    // parseSymbol,
    // parseKeyword,

    // parseQuoted,

    // parseList,
])))

