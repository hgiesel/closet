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
} from './types'

////////// CONSTRUCTORS FOR BASIC TYPES

export const mkUnit = (): SlangUnit => ({
    kind: SlangTypes.Unit,
})

export const isUnit = (val: Slang): val is SlangUnit => {
    return val.kind === SlangTypes.Unit
}

export const mkBool = (v: boolean): SlangBool => ({
    kind: SlangTypes.Bool,
    value: v,
})

export const isBool = (val: Slang): val is SlangBool => {
    return val.kind === SlangTypes.Bool
}

export const mkNumber = (re: number): SlangNumber => ({
    kind: SlangTypes.Number,
    real: Number(re),
})

export const isNumber = (val: Slang): val is SlangNumber => {
    return val.kind === SlangTypes.Number
}

export const mkSymbol = (x: string): SlangSymbol => ({
    kind: SlangTypes.Symbol,
    value: x,
})

export const isSymbol = (val: Slang): val is SlangSymbol => {
    return val.kind === SlangTypes.Symbol
}

export const mkKeyword = (x: string): SlangKeyword => ({
    kind: SlangTypes.Keyword,
    value: x,
})

export const isKeyword = (val: Slang): val is SlangKeyword => {
    return val.kind === SlangTypes.Keyword
}

export const mkString = (x: string): SlangString => ({
    kind: SlangTypes.String,
    value: x,
})

export const isString = (val: Slang): val is SlangString => {
    return val.kind === SlangTypes.String
}

////////// CONSTRUCTORS FOR RECURSIVE TYPES

export const mkQuoted = (x: Slang): SlangQuoted => ({
    kind: SlangTypes.Quoted,
    quoted: x,
})

export const isQuoted = (val: Slang): val is SlangQuoted => {
    return val.kind === SlangTypes.Quoted
}

export const mkOptional = (x?: Slang): SlangOptional => ({
    kind: SlangTypes.Optional,
    boxed: x ?? null,
})

export const isOptional = (val: Slang): val is SlangOptional => {
    return val.kind === SlangTypes.Optional
}

export const mkList = (head: Slang, tail: Slang[]): SlangList => ({
    kind: SlangTypes.List,
    head: head,
    tail: tail,
})

export const isList = (val: Slang): val is SlangList => {
    return val.kind === SlangTypes.List
}

export const mkVector = (members: Slang[]): SlangVector => ({
    kind: SlangTypes.Vector,
    members: members,
})

export const isVector = (val: Slang): val is SlangVector => {
    return val.kind === SlangTypes.Vector
}

const mapMapKey = (v: SlangString | SlangKeyword) => {
    if (v.kind === SlangTypes.String) {
        return v.value
    }

    return Symbol.for(v.value)
}

export const mkMap = (vs: [SlangString | SlangKeyword, Slang][]): SlangMap => {
    const theMap: Map<string | Symbol, Slang> = new Map()

    for (const v of vs) {
        theMap.set(mapMapKey(v[0]), v[1])
    }

    return {
        kind: SlangTypes.Map,
        table: theMap,
    }
}

export const isMap = (val: Slang): val is SlangMap => {
    return val.kind === SlangTypes.Map
}

export const mkFunction = (params: SlangSymbol[], body: Slang): SlangFunction => ({
    kind: SlangTypes.Function,
    params: params,
    body: body,
})

export const isFunction = (val: Slang): val is SlangFunction => {
    return val.kind === SlangTypes.Function
}

/////////////////

export const mkProg = (xs: Slang[]): SlangProg => ({
    kind: SlangTypes.Prog,
    expressions: xs,
})

export const mkDef = (id: SlangSymbol, val: Slang): SlangDef => ({
    kind: SlangTypes.Def,
    identifier: id,
    value: val,
})

export const isDef = (val: Slang): val is SlangDef => {
    return val.kind === SlangTypes.Def
}

// // defaults to Unit
// export interface SlangIf {
//     kind: SlangTypes.If,
//     condition: Slang,
//     thenClause: Slang,
//     elseClause: Slang,
// }

// export interface SlangDo {
//     kind: SlangTypes.Do,
//     statements: Slang[]
// }

// export interface SlangLet {
//     kind: SlangTypes.Let,
//     bindings: Map<string, Slang>,
//     body: Slang,
// }

// // defaults to Unit
// export interface SlangCond {
//     kind: SlangTypes.Cond,
//     tests: [Slang, Slang][],
// }

// export interface SlangCase {
//     kind: SlangTypes.Case,
//     variable: SlangSymbol,
//     tests: [Slang, Slang][],
//     // defaults to Unit
//     elseClause: Slang | null,
// }

// export interface SlangFor {
//     kind: SlangTypes.For,
//     bindings: Map<string, Slang>,
//     body: Slang,
// }

// export interface SlangDotimes {
//     kind: SlangTypes.Dotimes,
//     binding: [string, Slang],
//     body: Slang,
// }
