import type { SlangError } from './closetExecutor/exception'

export enum SlangType {
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
    Optic = 'optic',

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
    kind: SlangType.Unit
}

export interface SlangBool {
    kind: SlangType.Bool
    value: boolean,
}

export interface SlangNumber {
    kind: SlangType.Number
    value: number,
}

export interface SlangSymbol {
    kind: SlangType.Symbol
    value: string,
}

export interface SlangKeyword {
    kind: SlangType.Keyword
    value: string,
}

export interface SlangString {
    kind: SlangType.String
    value: string,
}

export interface SlangRegex {
    kind: SlangType.Regex
    value: RegExp,
}

////////////////// RECURSIVE TYPES

export interface SlangList {
    kind: SlangType.List
    head: Slang,
    tail: Slang[],
}

export interface SlangVector {
    kind: SlangType.Vector
    members: Slang[],
}

export interface SlangMap {
    kind: SlangType.Map,
    table: Map<string | symbol, Slang>,
}

export interface SlangMapEntry {
    kind: SlangType.MapEntry,
    first: SlangMapKey,
    second: Slang,
}

export interface SlangQuoted {
    kind: SlangType.Quoted,
    quoted: Slang,
}

export interface SlangOptional {
    kind: SlangType.Optional,
    boxed: Slang | null,
}

export interface SlangAtom {
    kind: SlangType.Atom,
    atom: Slang,
}

export interface SlangEitherRight {
    kind: SlangType.Either,
    ok: true,
    value: Slang,
}

export interface SlangEitherLeft {
    kind: SlangType.Either,
    ok: false,
    error: SlangError,
}

export type SlangEither = SlangEitherRight
                        | SlangEitherLeft

//////////////////

export interface SlangFunction {
    kind: SlangType.Function,
    name: string,
    params: SlangSymbol[],
    body: Slang,
}

export enum OpticType {
    Setter = 'setter',
    Fold = 'fold',
    Traversal = 'traversal',
    Affine = 'affine',
    Getter = 'getter',
    Lens = 'lens',
    Prism = 'prism',
    Iso = 'iso',
}

export interface SlangOptic {
    kind: SlangType.Optic,
    subkind: OpticType,
    name: string,
    zooms: Function[],
}

export interface SlangShcutFunction {
    kind: SlangType.ShcutFunction,
    name: string,
    params: number,
    body: Slang,
}

export interface SlangArmedFunction {
    kind: SlangType.ArmedFunction,
    name: string,
    apply: (args: Slang[], ctx: Map<string, Slang>) => SlangEither,
}

//////////////////

export interface SlangDo {
    kind: SlangType.Do,
    expressions: Slang[]
}

export interface SlangDef {
    kind: SlangType.Def,
    identifier: SlangSymbol,
    value: Slang,
}

export interface SlangLet {
    kind: SlangType.Let,
    bindings: Map<string, Slang>,
    body: Slang,
}

export interface SlangIf {
    kind: SlangType.If,
    condition: Slang,
    thenClause: Slang,
    elseClause: Slang /* default to Unit */,
}

export interface SlangCond {
    kind: SlangType.Cond,
    tests: [Slang, Slang][],
}

export interface SlangCase {
    kind: SlangType.Case,
    variable: SlangSymbol,
    tests: [Slang, Slang][],
}

export interface SlangFor {
    kind: SlangType.For,
    bindings: Map<string, Slang>,
    body: Slang,
}

export interface SlangDoseq {
    kind: SlangType.Doseq,
    bindings: Map<string, Slang>,
    body: Slang,
}

export interface SlangThreadFirst {
    kind: SlangType.ThreadFirst,
    value: Slang,
    pipes: Slang[],
}

export interface SlangThreadLast {
    kind: SlangType.ThreadLast,
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
                  | SlangOptic
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
