import { SlangError } from './executor/exception'

export enum SlangTypes {
    Unit = 'unit',
    Bool = 'bool',
    Number = 'number',
    String = 'string',
    Regex = 'regex',

    Symbol = 'symbol',
    Keyword = 'keyword',

    Quoted = 'quoted',
    Optional = 'optional',
    Atom = 'atom',
    Either = 'either',

    List = 'list',
    Vector = 'vector',
    Map = 'map',
    MapEntry = 'mapentry',

    Function = 'fun',
    ShcutFunction = 'shcutfun',
    ArmedFunction = 'armedfun',

    // Statement blocks
    Def = 'def',
    If = 'if',
    Do = 'do',
    Let = 'let',
    Cond = 'cond',
    Case = 'case',

    For = 'for',
    Doseq = 'doseq',

    ThreadFirst = 'threadfirst',
    ThreadLast = 'threadlast',
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
    value: number,
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

export interface SlangRegex {
    kind: SlangTypes.Regex
    value: RegExp,
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
    kind: SlangTypes.Map,
    table: Map<string | symbol, Slang>,
}

export interface SlangMapEntry {
    kind: SlangTypes.MapEntry,
    first: SlangMapKey,
    second: Slang,
}

export interface SlangQuoted {
    kind: SlangTypes.Quoted,
    quoted: Slang,
}

export interface SlangOptional {
    kind: SlangTypes.Optional,
    boxed: Slang | null,
}

export interface SlangAtom {
    kind: SlangTypes.Atom,
    atom: Slang,
}

export interface SlangEitherRight {
    kind: SlangTypes.Either,
    ok: true,
    value: Slang,
}

export interface SlangEitherLeft {
    kind: SlangTypes.Either,
    ok: false,
    error: SlangError,
}

export type SlangEither = SlangEitherRight
                        | SlangEitherLeft

//////////////////

export interface SlangFunction {
    kind: SlangTypes.Function,
    name: string,
    params: SlangSymbol[],
    body: Slang,
}

export interface SlangShcutFunction {
    kind: SlangTypes.ShcutFunction,
    name: string,
    params: number,
    body: Slang,
}

export interface SlangArmedFunction {
    kind: SlangTypes.ArmedFunction,
    name: string,
    apply: (args: Slang[], ctx: Map<string, Slang>) => SlangEither,
}

//////////////////

export interface SlangDo {
    kind: SlangTypes.Do,
    expressions: Slang[]
}

export interface SlangDef {
    kind: SlangTypes.Def,
    identifier: SlangSymbol,
    value: Slang,
}

export interface SlangLet {
    kind: SlangTypes.Let,
    bindings: Map<string, Slang>,
    body: Slang,
}

export interface SlangIf {
    kind: SlangTypes.If,
    condition: Slang,
    thenClause: Slang,
    elseClause: Slang /* default to Unit */,
}

export interface SlangCond {
    kind: SlangTypes.Cond,
    tests: [Slang, Slang][],
}

export interface SlangCase {
    kind: SlangTypes.Case,
    variable: SlangSymbol,
    tests: [Slang, Slang][],
}

export interface SlangFor {
    kind: SlangTypes.For,
    bindings: Map<string, Slang>,
    body: Slang,
}

export interface SlangDoseq {
    kind: SlangTypes.Doseq,
    bindings: Map<string, Slang>,
    body: Slang,
}

export interface SlangThreadFirst {
    kind: SlangTypes.ThreadFirst,
    value: Slang,
    pipes: Slang[],
}

export interface SlangThreadLast {
    kind: SlangTypes.ThreadLast,
    value: Slang,
    pipes: Slang[],
}

//////////////////
export type SlangMappable = SlangList
                          | SlangVector
                          | SlangOptional

export type SlangSeq = SlangMappable
                     | SlangMap

export type SlangMapKey = SlangString
                        | SlangKeyword

export type SlangExecutable = SlangFunction
                            | SlangShcutFunction
                            | SlangArmedFunction
                            | SlangVector
                            | SlangMap

// everything but SlangProg
export type Slang = SlangUnit
                  | SlangBool
                  | SlangNumber
                  | SlangString
                  | SlangRegex

                  | SlangSymbol
                  | SlangKeyword

                  | SlangQuoted
                  | SlangAtom
                  | SlangEither

                  | SlangList
                  | SlangVector
                  | SlangMap
                  | SlangMapEntry
                  | SlangOptional

                  | SlangFunction
                  | SlangShcutFunction
                  | SlangArmedFunction

                  | SlangDef
                  | SlangLet
                  | SlangDo
                  | SlangIf
                  | SlangCond
                  | SlangCase

                  | SlangFor
                  | SlangDoseq

                  | SlangThreadFirst
                  | SlangThreadLast
