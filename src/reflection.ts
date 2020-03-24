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

    SlangQuoted,
    SlangOptional,
    SlangAtom,
    SlangEither,
    SlangEitherRight,

    SlangList,
    SlangVector,
    SlangMap,

    SlangFunction,
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

    SlangMapKey,
    SlangExecutable,
} from './types'

export const isUnit = (val: Slang): val is SlangUnit => val.kind === SlangType.Unit
export const isBool = (val: Slang): val is SlangBool => val.kind === SlangType.Bool
export const isNumber = (val: Slang): val is SlangNumber => val.kind === SlangType.Number
export const isSymbol = (val: Slang): val is SlangSymbol => val.kind === SlangType.Symbol
export const isKeyword = (val: Slang): val is SlangKeyword => val.kind === SlangType.Keyword
export const isString = (val: Slang): val is SlangString => val.kind === SlangType.String
export const isRegex = (val: Slang): val is SlangRegex => val.kind === SlangType.Regex

export const isQuoted = (val: Slang): val is SlangQuoted => val.kind === SlangType.Quoted
export const isOptional = (val: Slang): val is SlangOptional => val.kind === SlangType.Optional
export const isAtom = (val: Slang): val is SlangAtom => val.kind === SlangType.Atom
export const isEither = (val: Slang): val is SlangEither => val.kind === SlangType.Either

export const isOk = (val: SlangEither): val is SlangEitherRight => val.ok

export const isList = (val: Slang): val is SlangList => val.kind === SlangType.List
export const isVector = (val: Slang): val is SlangVector => val.kind === SlangType.Vector
export const isMap = (val: Slang): val is SlangMap => val.kind === SlangType.Map

export const isFunction = (val: Slang): val is SlangFunction => val.kind === SlangType.Function
export const isShcutFunction = (val: Slang): val is SlangShcutFunction => val.kind === SlangType.ShcutFunction
export const isArmedFunction = (val: Slang): val is SlangArmedFunction => val.kind === SlangType.ArmedFunction

export const isOptic = (val: Slang): val is SlangOptic => val.kind === SlangType.Optic
export const isOpticCoercable = (val: Slang): val is SlangOptic => (
    isOptic(val)   ||
    isNumber(val)  ||
    isString(val)  ||
    isKeyword(val)
)

export const isDo = (val: Slang): val is SlangDo => val.kind === SlangType.Do
export const isDef = (val: Slang): val is SlangDef => val.kind === SlangType.Def
export const isLet = (val: Slang): val is SlangLet => val.kind === SlangType.Let
export const isIf = (val: Slang): val is SlangIf => val.kind === SlangType.If
export const isCond = (val: Slang): val is SlangCond => val.kind === SlangType.Cond
export const isCase = (val: Slang): val is SlangCase => val.kind === SlangType.Case

export const isFor = (val: Slang): val is SlangFor => val.kind === SlangType.For
export const isDoseq = (val: Slang): val is SlangDoseq => val.kind === SlangType.Doseq
export const isThreadFirst = (val: Slang): val is SlangThreadFirst => val.kind === SlangType.ThreadFirst
export const isThreadLast = (val: Slang): val is SlangThreadLast => val.kind === SlangType.ThreadLast

export const isExecutable = (val: Slang): val is SlangExecutable => (
    isFunction(val)      ||
    isShcutFunction(val) ||
    isArmedFunction(val) ||
    isNumber(val)        ||
    isMapKey(val)
)

export const isMapKey = (val: Slang): val is SlangMapKey => (
    isString(val) ||
    isKeyword(val)
)
