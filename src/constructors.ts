import {
    SlangTypes,
    Slang,

    SlangUnit,
    SlangBool,
    SlangNumber,
    SlangSymbol,
    SlangUnsymbol,
    SlangKeyword,
    SlangString,

    SlangList,
    SlangVector,
    SlangMap,
    SlangQuoted,
    SlangOptional,
    SlangProg,
} from './types'

////////// CONSTRUCTORS FOR TEMPLATES

enum Element {
    Text,
    ValueSet,
}

const getSub = (valueSetName: string) => 0

const initialChars = /^[^0-9]+/u
const trailingNumbers = /[0-9]*$/u

const mkText = (text: string) => ({
    kind: Element.Text,
    value: text,
})

const mkValueSet = (values: string[]) => {
    const name: string = values[0].match(initialChars)[0]

    const idxString: string = values[0].match(trailingNumbers)[0]
    const idx: number = idxString.length === 0 ? null : Number(idxString)

    return {
        kind: Element.ValueSet,
        fullName: values[0],
        name: name,
        idx: idx,
        sub: getSub(values[0]),
        values: values.slice(1),
    }
}

export const mkElement = (values: string[]) => {
    return values.length === 1
        ? mkText(values[0])
        : mkValueSet(values)
}

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

export const mkUnsymbol = (x: string): SlangUnsymbol => ({
    kind: SlangTypes.Unsymbol,
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

export const mkList = (head: Slang, tail: Slang[]): SlangList => ({
    kind: SlangTypes.List,
    head: head,
    tail: tail,
})

export const mkVector = (members: Slang[]): SlangVector => ({
    kind: SlangTypes.Vector,
    members: members,
})

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

export const mkQuoted = (x: Slang): SlangQuoted => ({
    kind: SlangTypes.Quoted,
    quoted: x,
})

export const mkOptional = (x: Slang | null): SlangOptional => ({
    kind: SlangTypes.Optional,
    boxed: x,
})

export const mkProg = (xs: Slang[]): SlangProg => ({
    kind: SlangTypes.Prog,
    statements: xs,
})
