import {
    SlangTypes,
    Slang,

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
    SlangFunction,

    SlangProg,
    SlangDef,
    SlangIf,
    SlangCond,
    SlangCase,
    SlangDo,
    SlangLet,

    SlangFor,
    SlangDotimes,
} from './types'

////////// CONSTRUCTORS FOR BASIC TYPES

export const isUnit = (val: Slang): val is SlangUnit => val.kind === SlangTypes.Unit
export const mkUnit = (): SlangUnit => ({
    kind: SlangTypes.Unit,
})

export const isBool = (val: Slang): val is SlangBool => val.kind === SlangTypes.Bool
export const mkBool = (v: boolean): SlangBool => ({
    kind: SlangTypes.Bool,
    value: v,
})

export const isNumber = (val: Slang): val is SlangNumber => val.kind === SlangTypes.Number
export const mkNumber = (re: number): SlangNumber => ({
    kind: SlangTypes.Number,
    real: Number(re),
})

export const isSymbol = (val: Slang): val is SlangSymbol => val.kind === SlangTypes.Symbol
export const mkSymbol = (x: string): SlangSymbol => ({
    kind: SlangTypes.Symbol,
    value: x,
})

export const isKeyword = (val: Slang): val is SlangKeyword => val.kind === SlangTypes.Keyword
export const mkKeyword = (x: string): SlangKeyword => ({
    kind: SlangTypes.Keyword,
    value: x,
})

export const isString = (val: Slang): val is SlangString => val.kind === SlangTypes.String
export const mkString = (x: string): SlangString => ({
    kind: SlangTypes.String,
    value: x,
})

////////// CONSTRUCTORS FOR RECURSIVE TYPES

const mapKey = (v: SlangSymbol | SlangString): string => v.value
const mapKwKey = (v: SlangKeyword): symbol => Symbol.for(v.value)

export const isQuoted = (val: Slang): val is SlangQuoted => val.kind === SlangTypes.Quoted
export const mkQuoted = (x: Slang): SlangQuoted => ({
    kind: SlangTypes.Quoted,
    quoted: x,
})

export const isOptional = (val: Slang): val is SlangOptional => val.kind === SlangTypes.Optional
export const mkOptional = (x?: Slang): SlangOptional => ({
    kind: SlangTypes.Optional,
    boxed: x ?? null,
})

export const isList = (val: Slang): val is SlangList => val.kind === SlangTypes.List
export const mkList = (head: Slang, tail: Slang[]): SlangList => ({
    kind: SlangTypes.List,
    head: head,
    tail: tail,
})


export const isVector = (val: Slang): val is SlangVector => val.kind === SlangTypes.Vector
export const mkVector = (members: Slang[]): SlangVector => ({
    kind: SlangTypes.Vector,
    members: members,
})

export const isMap = (val: Slang): val is SlangMap => val.kind === SlangTypes.Map
export const mkMap = (vs: [SlangString | SlangKeyword, Slang][]): SlangMap => {
    const theMap: Map<string | Symbol, Slang> = new Map()

    for (const v of vs) {
        theMap.set(
            isString(v[0]) ? mapKey(v[0]) : mapKwKey(v[0]),
            v[1],
        )
    }

    return {
        kind: SlangTypes.Map,
        table: theMap,
    }
}


export const isFunction = (val: Slang): val is SlangFunction => val.kind === SlangTypes.Function
export const mkFunction = (params: SlangSymbol[], body: Slang): SlangFunction => ({
    kind: SlangTypes.Function,
    params: params,
    body: body,
})


/////////////////

export const mkProg = (xs: Slang[]): SlangProg => ({
    kind: SlangTypes.Prog,
    expressions: xs,
})

export const isDo = (val: Slang): val is SlangDo => val.kind === SlangTypes.Do
export const mkDo = (exprs: Slang[]): SlangDo => ({
    kind: SlangTypes.Do,
    expressions: exprs,
})

//////////////////// Bindings

export const isDef = (val: Slang): val is SlangDef => val.kind === SlangTypes.Def
export const mkDef = (id: SlangSymbol, val: Slang): SlangDef => ({
    kind: SlangTypes.Def,
    identifier: id,
    value: val,
})

export const isLet = (val: Slang): val is SlangLet => val.kind === SlangTypes.Let
export const mkLet = (vs: [SlangSymbol, Slang][], body: Slang): SlangLet => {
    const theBindings: Map<string, Slang> = new Map()

    for (const v of vs) {
        theBindings.set(mapKey(v[0]), v[1])
    }

    return {
        kind: SlangTypes.Let,
        bindings: theBindings,
        body: body,
    }
}

//////////////////// Conditionals

export const isIf = (val: Slang): val is SlangIf => val.kind === SlangTypes.If
export const mkIf = (condition: Slang, thenClause: Slang, elseClause: Slang): SlangIf => ({
    kind: SlangTypes.If,
    condition: condition,
    thenClause: thenClause,
    elseClause: elseClause,
})

export const isCond = (val: Slang): val is SlangCond => val.kind === SlangTypes.Cond
export const mkCond = (tests: [Slang, Slang][]): SlangCond => ({ 
    kind: SlangTypes.Cond,
    tests: tests,
})

export const isCase = (val: Slang): val is SlangCase => val.kind === SlangTypes.Case
export const mkCase = (variable: SlangSymbol, tests: [Slang, Slang][], elseClause: Slang): SlangCase => ({
    kind: SlangTypes.Case,
    variable: variable,
    tests: tests,
    elseClause: elseClause /* defaults to Unit */,
})

//////////////////// Iteration

export const isFor = (val: Slang): val is SlangFor => val.kind === SlangTypes.For
export const mkFor = (vs: [SlangSymbol, Slang][], body: Slang): SlangFor => {
    const theBindings: Map<string, Slang> = new Map()

    for (const v of vs) {
        theBindings.set(mapKey(v[0]), v[1])
    }

    return {
        kind: SlangTypes.For,
        bindings: theBindings,
        body: body,
    }
}

export const isDotimes = (val: Slang): val is SlangDotimes => val.kind === SlangTypes.Dotimes
export const mkDotimes = (binding: [string, Slang], body: Slang): SlangDotimes => ({
    kind: SlangTypes.Dotimes,
    binding: binding,
    body: body,
})
