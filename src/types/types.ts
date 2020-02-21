export enum SlangTypes {
    String = 'string',
    Number = 'number',
    Bool = 'bool',
    Unit = 'unit',

    Symbol = 'symbol',
    Keyword = 'keyword',

    Quoted = 'quoted',

    List = 'list',
    Vector = 'vector',
    Map = 'map',

    Prog = 'prog',
}

import {
    SlangString,
} from './string'

import {
    SlangNumber,
} from './number'

import {
    SlangBool,
} from './bool'

import {
    SlangUnit,
} from './unit'

import {
    SlangSymbol,
    SlangKeyword,
} from './symbol'

import {
    SlangQuoted,
} from './quoted'

import {
    SlangList,
} from './list'

// import {
//     SlangVector,
// } from './vector'

// import {
//     SlangMap,
// } from './map'

export type Slang = SlangString
                  | SlangNumber
                  | SlangBool
                  | SlangUnit

                  | SlangSymbol
                  | SlangKeyword

                  | SlangQuoted

                  | SlangList
                  // | SlangVector
                  // | SlangMap
