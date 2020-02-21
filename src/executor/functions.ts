import type {
    Slang,
    SlangFunction,
    SlangShcutFunction,
    SlangArmedFunction,
    SlangVector,
    SlangNumber,
    SlangMap,
    SlangMapKey,
    SlangExecutable,
} from '../types'

import {
    isFunction,
    isShcutFunction,
    isArmedFunction,
    isVector,
    isNumber,
    isMap,
    isMapKey,
} from '../reflection'

import {
    mkArmedFunction,
} from '../constructors'

import {
    createEnv,
    createNumberedEnv,
    joinEnvs,
} from './lookup'

import {
    typecheck,
    notExecutable,
} from './exception'

import {
    indexing as vectorIndexing,
} from './vector'

import {
    indexing as mapIndexing,
} from './map'

import execute from './executor'

export const wrap = (func: (a: Slang[], ctx: Map<string, Slang>) => Slang): SlangArmedFunction => (
    mkArmedFunction((args, ctx) => func(args.map(t => execute(t, ctx)), ctx))
)

export const armFunc = (name: string, func: SlangFunction): SlangArmedFunction => (
    mkArmedFunction(typecheck(name, (args, ctx) => execute(
        func.body,
        joinEnvs(ctx, createEnv(
            func.params,
            args.map(t => execute(t, ctx)),
        )),
    ), {
        argc: (count) => count === func.params.length,
    }))
)

export const armShcut = (name: string, func: SlangShcutFunction): SlangArmedFunction => (
    mkArmedFunction(typecheck(`anon_${name}`, (args, ctx) => execute(
        func.body,
        joinEnvs(ctx, createNumberedEnv(
            args.map(t => execute(t, ctx)),
        )),
    ), {
        argc: (count) => count === func.params,
    }))
)


export const armVector = (vec: SlangVector): SlangArmedFunction => (
    mkArmedFunction(typecheck(
        'vectorindexing',
        (args: [SlangNumber], _ctx) => vectorIndexing([vec, ...args] as any), {
            argc: (count) => count === 1,
            arg0: (s) => isNumber(s),
        }))
)

export const armMap = (map: SlangMap): SlangArmedFunction => (
    mkArmedFunction(typecheck(
        'mapindexing',
        (args: [SlangMapKey], _ctx) => mapIndexing([map, ...args] as any), {
            argc: (count) => count === 1,
            arg0: (s) => isMapKey(s),
        }))
)

export const arm = (name: string, exec: Slang): SlangArmedFunction => (
    isArmedFunction(exec)
    ? exec
    : isFunction(exec)
    ? armFunc(name, exec)
    : isShcutFunction(exec)
    ? armShcut(name, exec)
    : isVector(exec)
    ? armVector(exec)
    : isMap(exec)
    ? armMap(exec)
    : notExecutable(exec.kind)
)
