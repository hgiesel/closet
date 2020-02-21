import type {
    Slang,
    SlangFunction,
    SlangShcutFunction,
    SlangArmedFunction,
    SlangVector,
    SlangNumber,
    SlangMap,
    SlangMapKey,
    SlangEither,
} from '../types'

import {
    isFunction,
    isShcutFunction,
    isArmedFunction,
    isVector,
    isEither,
    isNumber,
    isMap,
    isMapKey,
    isOk,
} from '../reflection'

import {
    mkArmedFunction,
    mkRight,
} from '../constructors'

import {
    createEnv,
    createNumberedEnv,
    joinEnvs,
} from './lookup'

import {
    typecheck,
    notExecutable,
    throwException,
} from './exception'

import {
    indexing as vectorIndexing,
} from './vector'

import {
    indexing as mapIndexing,
} from './map'

import execute from './executor'

export const apply = (func: SlangArmedFunction, args: Slang[], ctx: Map<string, Slang>): Slang => {
    const result = func.apply(args, ctx)

    if (isOk(result)) {
        return result.value
    }

    throwException(func.name, result.error)
}

const adapt = (sl: Slang): SlangEither => {
    return isEither(sl)
        ? sl
        : mkRight(sl)
}

export const wrap = (name: string, func: (a: Slang[], ctx: Map<string, Slang>) => Slang): SlangArmedFunction => (
    mkArmedFunction(
        name,
        (args, ctx) => (console.log(args), adapt(func(args.map(t => execute(t, ctx)), ctx))),
    )
)

export const armFunc = (func: SlangFunction): SlangArmedFunction => (
    mkArmedFunction(func.name, typecheck({
        f: (args, ctx) => execute(
            func.body,
            joinEnvs(ctx, createEnv(
                func.params,
                args.map(t => execute(t, ctx)),
            )),
        ),
        argc: (count) => count === func.params.length,
    }))
)

export const armShcut = (func: SlangShcutFunction): SlangArmedFunction => (
    mkArmedFunction(func.name, typecheck({
        f: (args, ctx) => execute(
            func.body,
            joinEnvs(ctx, createNumberedEnv(
                args.map(t => execute(t, ctx)),
            )),
        ),
        argc: (count) => count === func.params,
    }))
)

const armVector = (vec: SlangVector): SlangArmedFunction => (
    mkArmedFunction('vectorIndexing', typecheck({
        f: (args: [SlangNumber], _ctx) => vectorIndexing([vec, ...args] as any),
        argc: (count) => count === 1,
        arg0: (s) => isNumber(s),
    }))
)

const armMap = (map: SlangMap): SlangArmedFunction => (
    mkArmedFunction('mapIndexing', typecheck({
        f: (args: [SlangMapKey], _ctx) => mapIndexing([map, ...args] as any),
        argc: (count) => count === 1,
        arg0: (s) => isMapKey(s),
    }))
)

export const arm = (exec: Slang): SlangArmedFunction => (
    isArmedFunction(exec)
    ? exec
    : isFunction(exec)
    ? armFunc(exec)
    : isShcutFunction(exec)
    ? armShcut(exec)
    : isVector(exec)
    ? armVector(exec)
    : isMap(exec)
    ? armMap(exec)
    : throwException('list', notExecutable(exec.kind))
)

export const fire = (exec: Slang, args: Slang[], ctx: Map<string, Slang>): Slang => {
    return apply(arm(exec), args, ctx)
}
