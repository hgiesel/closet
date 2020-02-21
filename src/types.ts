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
} from './parsers/basic'

import {
    SlangQuoted,
    SlangOptional,
    SlangList,
    SlangVector,
    SlangMap,
} from './parsers/recursive'

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

export {
    SlangUnit,
    SlangBool,
    SlangNumber,
    SlangSymbol,
    SlangKeyword,
    SlangString,
    SlangQuoted,
    SlangOptional,
    SlangList,
    SlangVector,
    SlangMap,
}
