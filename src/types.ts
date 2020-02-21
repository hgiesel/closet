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
    Function = 'function',

    // Statement blocks
    Prog = 'prog',

    Def = 'def',
    If = 'if',
    Do = 'do',
    Let = 'let',
    Cond = 'cond',
    Case = 'case',
    For = 'for',
    Dotimes = 'dotimes',
}

////////////////// BASIC TYPES

export interface SlangUnit {
    kind: SlangTypes.Unit
}

export interface SlangBool {
    kind: SlangTypes.Bool
    value: boolean,
}

export interface SlangNumber {
    kind: SlangTypes.Number
    real: number,
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

export interface SlangFunction {
    kind: SlangTypes.Function,
    params: SlangSymbol[],
    body: Slang,
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
                  | SlangFunction

//////////////////

export interface SlangProg {
    kind: SlangTypes.Prog
    statements: Slang[]
}

export interface SlangDef {
    kind: SlangTypes.Def,
    identifier: SlangSymbol,
    value: Slang,
}

// defaults to Unit
export interface SlangIf {
    kind: SlangTypes.If,
    condition: Slang,
    thenClause: Slang,
    elseClause: Slang,
}

export interface SlangDo {
    kind: SlangTypes.Do,
    statements: Slang[]
}

export interface SlangLet {
    kind: SlangTypes.Let,
    bindings: Map<string, Slang>,
    body: Slang,
}

// defaults to Unit
export interface SlangCond {
    kind: SlangTypes.Cond,
    tests: [Slang, Slang][],
}

export interface SlangCase {
    kind: SlangTypes.Case,
    variable: SlangSymbol,
    tests: [Slang, Slang][],
    // defaults to Unit
    elseClause: Slang | null,
}

export interface SlangFor {
    kind: SlangTypes.For,
    bindings: Map<string, Slang>,
    body: Slang,
}

export interface SlangDotimes {
    kind: SlangTypes.Dotimes,
    binding: [string, Slang],
    body: Slang,
}

//////////////////

export type SlangConstructors = SlangProg
                              | SlangDef
                              | SlangIf
                              | SlangDo
                              | SlangCond
                              | SlangCase
                              | SlangFor
                              | SlangDotimes
