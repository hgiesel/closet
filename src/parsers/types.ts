export enum SlangTypes {
    String = 'string',
    Number = 'number',
    Bool = 'bool',
    Unit = 'unit',

    Symbol = 'symbol',
    Keyword = 'keyword',

    Quoted = 'quoted',
    Optional = 'optional',

    List = 'list',
    Vector = 'vector',
    Map = 'map',

    Prog = 'prog',
}

import {
    SlangUnit,
    SlangBool,
    SlangNumber,
    SlangSymbol,
    SlangKeyword,
    SlangString,
} from './basic'

import {
    SlangQuoted,
    SlangOptional,
    SlangList,
    SlangVector,
    SlangMap,
} from './recursive'

export type Slang = SlangString
                  | SlangNumber
                  | SlangBool
                  | SlangUnit

                  | SlangSymbol
                  | SlangKeyword

                  | SlangQuoted
                  | SlangOptional

                  | SlangList
                  | SlangVector
                  | SlangMap
