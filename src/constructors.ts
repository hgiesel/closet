import {
    SlangType,
    Slang,

    SlangUnit,
    SlangBool,
    SlangNumber,
    SlangSymbol,
    SlangKeyword,
    SlangString,
    SlangRegex,

    SlangMapKey,
    SlangMapEntry,

    SlangQuoted,
    SlangOptional,
    SlangAtom,
    SlangEither,
    SlangEitherLeft,
    SlangEitherRight,

    SlangList,
    SlangVector,
    SlangMap,

    SlangFunction,
    OpticType,
    SlangOptic,
    SlangShcutFunction,
    SlangArmedFunction,

    SlangDef,
    SlangIf,
    SlangCond,
    SlangCase,
    SlangDo,
    SlangLet,

    SlangFor,
    SlangDoseq,
    SlangThreadFirst,
    SlangThreadLast,
} from './types'

import type { SlangError } from './closetExecutor/exception'

const getValue = (v: SlangKeyword | SlangString | SlangSymbol): string => v.value

////////// CONSTRUCTORS FOR BASIC TYPES

export const mkUnit = (): SlangUnit => ({
    kind: SlangType.Unit,
})

export const mkBool = (v: boolean): SlangBool => ({
    kind: SlangType.Bool,
    value: v,
})

export const mkNumber = (re: number): SlangNumber => ({
    kind: SlangType.Number,
    value: Number(re),
})

export const mkSymbol = (x: string): SlangSymbol => ({
    kind: SlangType.Symbol,
    value: x,
})

export const mkKeyword = (x: string): SlangKeyword => ({
    kind: SlangType.Keyword,
    value: x,
})

export const mkString = (x: string): SlangString => ({
    kind: SlangType.String,
    value: x,
})

export const mkRegex = (x: string): SlangRegex => ({
    kind: SlangType.Regex,
    value: new RegExp(x),
})

////////// CONSTRUCTORS FOR RECURSIVE TYPES

export const toMapKey = (v: SlangMapKey): string | symbol => v.kind === SlangType.String
    ? v.value
    : Symbol.for(v.value)

export const fromMapKey = (v: string | symbol): SlangMapKey => typeof v === 'string'
    ? mkString(v)
    //@ts-ignore
    : mkKeyword(v.description)

export const mkQuoted = (x: Slang): SlangQuoted => ({
    kind: SlangType.Quoted,
    quoted: x,
})

export const mkOptional = (x: Slang): SlangOptional => ({
    kind: SlangType.Optional,
    boxed: x ?? null,
})

export const mkAtom = (x: Slang): SlangAtom => ({
    kind: SlangType.Atom,
    atom: x,
})

export const mkLeft = (e: SlangError): SlangEitherLeft => ({
    kind: SlangType.Either,
    ok: false,
    error: e,
})

export const mkRight = (val: Slang): SlangEitherRight => ({
    kind: SlangType.Either,
    ok: true,
    value: val,
})

export const mkList = (head: Slang, tail: Slang[]): SlangList => ({
    kind: SlangType.List,
    head: head,
    tail: tail,
})

export const mkVector = (members: Slang[]): SlangVector => ({
    kind: SlangType.Vector,
    members: members,
})

export const mkMapEntry = (first: SlangMapKey, second: Slang): SlangMapEntry => ({
    kind: SlangType.MapEntry,
    first: first,
    second: second,
})

export const mkMap = (vs: [SlangString | SlangKeyword, Slang][]): SlangMap => {
    const theMap: Map<string | symbol, Slang> = new Map()

    for (const [key, value] of vs) {
        theMap.set(toMapKey(key), value)
    }

    return {
        kind: SlangType.Map,
        table: theMap,
    }
}

export const mkMapDirect = (table: Map<string | symbol, Slang>): SlangMap => ({
    kind: SlangType.Map,
    table: table,
})

//////////////////// Functions

export const mkFunction = (name: string, params: SlangSymbol[], body: Slang): SlangFunction => ({
    kind: SlangType.Function,
    name: name,
    params: params,
    body: body,
})

export const mkOptic = (opticType: OpticType, name: string, zooms: Function[]): SlangOptic => ({
    kind: SlangType.Optic,
    subkind: opticType,
    name: name,
    zooms: zooms,
})

export const mkShcutFunction = (name: string, params: number, body: Slang): SlangShcutFunction => ({
    kind: SlangType.ShcutFunction,
    name: name,
    params: params,
    body: body,
})

export const mkArmedFunction = (name: string, app: (args: Slang[], ctx: Map<string, Slang>) => SlangEither): SlangArmedFunction => ({
    kind: SlangType.ArmedFunction,
    name: name,
    apply: app,
})

///////////////// Bindings

export const mkDo = (exprs: Slang[]): SlangDo => ({
    kind: SlangType.Do,
    expressions: exprs,
})

export const mkDef = (id: SlangSymbol, val: Slang): SlangDef => ({
    kind: SlangType.Def,
    identifier: id,
    value: val,
})

export const mkLet = (vs: [SlangSymbol, Slang][], body: Slang): SlangLet => {
    const theBindings: Map<string, Slang> = new Map()

    for (const v of vs) {
        theBindings.set(getValue(v[0]), v[1])
    }

    return {
        kind: SlangType.Let,
        bindings: theBindings,
        body: body,
    }
}

//////////////////// Conditionals

export const mkIf = (condition: Slang, thenClause: Slang, elseClause: Slang): SlangIf => ({
    kind: SlangType.If,
    condition: condition,
    thenClause: thenClause,
    elseClause: elseClause,
})

export const mkCond = (tests: [Slang, Slang][]): SlangCond => ({ 
    kind: SlangType.Cond,
    tests: tests,
})

export const mkCase = (variable: SlangSymbol, tests: [Slang, Slang][]): SlangCase => ({
    kind: SlangType.Case,
    variable: variable,
    tests: tests,
})

//////////////////// Iteration

export const mkFor = (vs: [SlangSymbol, Slang][], body: Slang): SlangFor => {
    const theBindings: Map<string, Slang> = new Map()

    for (const v of vs) {
        theBindings.set(getValue(v[0]), v[1])
    }

    return {
        kind: SlangType.For,
        bindings: theBindings,
        body: body,
    }
}

export const mkDoseq = (vs: [SlangSymbol, Slang][], body: Slang): SlangDoseq => {
    const theBindings: Map<string, Slang> = new Map()

    for (const v of vs) {
        theBindings.set(getValue(v[0]), v[1])
    }

    return {
        kind: SlangType.Doseq,
        bindings: theBindings,
        body: body,
    }
}

export const mkThreadFirst = (value: Slang, pipes: Slang[]): SlangThreadFirst => ({
    kind: SlangType.ThreadFirst,
    value: value,
    pipes: pipes,
})

export const mkThreadLast = (value: Slang, pipes: Slang[]): SlangThreadLast => ({
    kind: SlangType.ThreadLast,
    value: value,
    pipes: pipes,
})
