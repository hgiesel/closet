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
    SlangShcutFunction,
    SlangArmedFunction,

    SlangDef,
    SlangIf,
    SlangCond,
    SlangCase,
    SlangDo,
    SlangLet,

    SlangFor,

    SlangMapKey,
    SlangExecutable,
} from './types'

export const isUnit = (val: Slang): val is SlangUnit => val.kind === SlangTypes.Unit
export const isBool = (val: Slang): val is SlangBool => val.kind === SlangTypes.Bool
export const isNumber = (val: Slang): val is SlangNumber => val.kind === SlangTypes.Number
export const isSymbol = (val: Slang): val is SlangSymbol => val.kind === SlangTypes.Symbol
export const isKeyword = (val: Slang): val is SlangKeyword => val.kind === SlangTypes.Keyword
export const isString = (val: Slang): val is SlangString => val.kind === SlangTypes.String

export const isQuoted = (val: Slang): val is SlangQuoted => val.kind === SlangTypes.Quoted
export const isOptional = (val: Slang): val is SlangOptional => val.kind === SlangTypes.Optional
export const isList = (val: Slang): val is SlangList => val.kind === SlangTypes.List
export const isVector = (val: Slang): val is SlangVector => val.kind === SlangTypes.Vector
export const isMap = (val: Slang): val is SlangMap => val.kind === SlangTypes.Map
export const isFunction = (val: Slang): val is SlangFunction => val.kind === SlangTypes.Function
export const isShcutFunction = (val: Slang): val is SlangShcutFunction => val.kind === SlangTypes.Function
export const isArmedFunction = (val: Slang): val is SlangArmedFunction => val.kind === SlangTypes.ArmedFunction
export const isDo = (val: Slang): val is SlangDo => val.kind === SlangTypes.Do
export const isDef = (val: Slang): val is SlangDef => val.kind === SlangTypes.Def
export const isLet = (val: Slang): val is SlangLet => val.kind === SlangTypes.Let
export const isIf = (val: Slang): val is SlangIf => val.kind === SlangTypes.If
export const isCond = (val: Slang): val is SlangCond => val.kind === SlangTypes.Cond
export const isCase = (val: Slang): val is SlangCase => val.kind === SlangTypes.Case
export const isFor = (val: Slang): val is SlangFor => val.kind === SlangTypes.For

export const isExecutable = (val: Slang): val is SlangExecutable => (
    isFunction(val) ||
    isShcutFunction(val) ||
    isArmedFunction(val) ||
    isVector(val) ||
    isMap(val)
)

export const isMapKey = (val: Slang): val is SlangMapKey => (
    isString(val) ||
    isKeyword(val)
)
