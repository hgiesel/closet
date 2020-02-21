import {
    SlangTypes,
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

import { SlangError } from './executor/exception'

const getValue = (v: SlangKeyword | SlangString | SlangSymbol): string => v.value

////////// CONSTRUCTORS FOR BASIC TYPES

export const mkUnit = (): SlangUnit => ({
    kind: SlangTypes.Unit,
})

export const mkBool = (v: boolean): SlangBool => ({
    kind: SlangTypes.Bool,
    value: v,
})

export const mkNumber = (re: number): SlangNumber => ({
    kind: SlangTypes.Number,
    value: Number(re),
})

export const mkSymbol = (x: string): SlangSymbol => ({
    kind: SlangTypes.Symbol,
    value: x,
})

export const mkKeyword = (x: string): SlangKeyword => ({
    kind: SlangTypes.Keyword,
    value: x,
})

export const mkString = (x: string): SlangString => ({
    kind: SlangTypes.String,
    value: x,
})

export const mkRegex = (x: string): SlangRegex => ({
    kind: SlangTypes.Regex,
    value: new RegExp(x),
})

////////// CONSTRUCTORS FOR RECURSIVE TYPES

export const toMapKey = (v: SlangMapKey): string | symbol => v.kind === SlangTypes.String
    ? v.value
    : Symbol.for(v.value)

export const fromMapKey = (v: string | symbol): SlangMapKey => typeof v === 'string'
    ? mkString(v)
    //@ts-ignore
    : mkKeyword(v.description)

export const mkQuoted = (x: Slang): SlangQuoted => ({
    kind: SlangTypes.Quoted,
    quoted: x,
})

export const mkOptional = (x: Slang): SlangOptional => ({
    kind: SlangTypes.Optional,
    boxed: x ?? null,
})

export const mkAtom = (x: Slang): SlangAtom => ({
    kind: SlangTypes.Atom,
    atom: x,
})

export const mkLeft = (e: SlangError): SlangEitherLeft => ({
    kind: SlangTypes.Either,
    ok: false,
    error: e,
})

export const mkRight = (val: Slang): SlangEitherRight => ({
    kind: SlangTypes.Either,
    ok: true,
    value: val,
})

export const mkList = (head: Slang, tail: Slang[]): SlangList => ({
    kind: SlangTypes.List,
    head: head,
    tail: tail,
})

export const mkVector = (members: Slang[]): SlangVector => ({
    kind: SlangTypes.Vector,
    members: members,
})

export const mkMapEntry = (first: SlangMapKey, second: Slang): SlangMapEntry => ({
    kind: SlangTypes.MapEntry,
    first: first,
    second: second,
})

export const mkMap = (vs: [SlangString | SlangKeyword, Slang][]): SlangMap => {
    const theMap: Map<string | symbol, Slang> = new Map()

    for (const [key, value] of vs) {
        theMap.set(toMapKey(key), value)
    }

    return {
        kind: SlangTypes.Map,
        table: theMap,
    }
}

export const mkMapDirect = (table: Map<string | symbol, Slang>): SlangMap => ({
    kind: SlangTypes.Map,
    table: table,
})

//////////////////// Functions

export const mkFunction = (name: string, params: SlangSymbol[], body: Slang): SlangFunction => ({
    kind: SlangTypes.Function,
    name: name,
    params: params,
    body: body,
})

export const mkShcutFunction = (name: string, params: number, body: Slang): SlangShcutFunction => ({
    kind: SlangTypes.ShcutFunction,
    name: name,
    params: params,
    body: body,
})

export const mkArmedFunction = (name: string, app: (args: Slang[], ctx: Map<string, Slang>) => SlangEither): SlangArmedFunction => ({
    kind: SlangTypes.ArmedFunction,
    name: name,
    apply: app,
})

///////////////// Bindings

export const mkDo = (exprs: Slang[]): SlangDo => ({
    kind: SlangTypes.Do,
    expressions: exprs,
})

export const mkDef = (id: SlangSymbol, val: Slang): SlangDef => ({
    kind: SlangTypes.Def,
    identifier: id,
    value: val,
})

export const mkLet = (vs: [SlangSymbol, Slang][], body: Slang): SlangLet => {
    const theBindings: Map<string, Slang> = new Map()

    for (const v of vs) {
        theBindings.set(getValue(v[0]), v[1])
    }

    return {
        kind: SlangTypes.Let,
        bindings: theBindings,
        body: body,
    }
}

//////////////////// Conditionals

export const mkIf = (condition: Slang, thenClause: Slang, elseClause: Slang): SlangIf => ({
    kind: SlangTypes.If,
    condition: condition,
    thenClause: thenClause,
    elseClause: elseClause,
})

export const mkCond = (tests: [Slang, Slang][]): SlangCond => ({ 
    kind: SlangTypes.Cond,
    tests: tests,
})

export const mkCase = (variable: SlangSymbol, tests: [Slang, Slang][]): SlangCase => ({
    kind: SlangTypes.Case,
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
        kind: SlangTypes.For,
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
        kind: SlangTypes.Doseq,
        bindings: theBindings,
        body: body,
    }
}

export const mkThreadFirst = (value: Slang, pipes: Slang[]): SlangThreadFirst => ({
    kind: SlangTypes.ThreadFirst,
    value: value,
    pipes: pipes,
})

export const mkThreadLast = (value: Slang, pipes: Slang[]): SlangThreadLast => ({
    kind: SlangTypes.ThreadLast,
    value: value,
    pipes: pipes,
})
