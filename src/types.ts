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

////////////////// BASIC TYPES

export interface SlangUnit {
    kind: SlangTypes.Unit
}

export interface SlangBool {
    kind: SlangTypes.Bool
    value: boolean,
}

export enum Sign {
    Positive,
    Negative,
}

export interface SlangNumber {
    kind: SlangTypes.Number
    sign: Sign,
    real: number,
    imaginary: number,
}

export interface SlangSymbol {
    kind: SlangTypes.Symbol
    value: string,
}

export interface SlangKeyword {
    kind: SlangTypes.Keyword
    value: string,
}

export interface SlangString {
    kind: SlangTypes.String
    value: string,
}

////////////////// RECURSIVE TYPES

export interface SlangList {
    kind: SlangTypes.List
    head: Slang,
    tail: Slang[],
}

export interface SlangVector {
    kind: SlangTypes.Vector
    members: Slang[],
}

export interface SlangMap {
    kind: SlangTypes.Map
    table: Map<string | Symbol, Slang>,
}

export interface SlangQuoted {
    kind: SlangTypes.Quoted,
    quoted: Slang,
}

export interface SlangOptional {
    kind: SlangTypes.Optional,
    boxed: Slang | null,
}

export interface SlangProg {
    kind: SlangTypes.Prog
    statements: Slang[]
}

//////////////////

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
