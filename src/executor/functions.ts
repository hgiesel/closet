import type {
    Slang,
    SlangFunction,
    SlangShcutFunction,
    SlangArmedFunction,
    SlangExecutable,
} from '../types'

import {
    isFunction,
    isShcutFunction,
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
    SlangArityError,
    typecheck,
} from './exception'

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

export const arm = (name: string, func: SlangExecutable): SlangArmedFunction => (
    isFunction(func)
    ? armFunc(name, func)
    : isShcutFunction(func)
    ? armShcut(name, func)
    : func
)
