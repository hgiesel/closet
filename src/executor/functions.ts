import type {
    Slang,
    SlangFunction,
    SlangShcutFunction,
    SlangArmedFunction,
} from '../types'

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
} from './exception'

import execute from './executor'

export const wrap = (func: (a: Slang[], ctx: Map<string, Slang>) => Slang): SlangArmedFunction => (
    mkArmedFunction((args, ctx) => func(args.map(t => execute(t, ctx)), ctx))
)

export const armFunc = (func: SlangFunction): SlangArmedFunction => (
    mkArmedFunction((args, ctx) => {
        if (func.params.length !== args.length) {
            throw new SlangArityError('f')
        }

        return execute(
            func.body,
            joinEnvs(ctx, createEnv(
                func.params,
                args.map(t => execute(t, ctx))
            )),
        )
    })
)

export const armShcut = (func: SlangShcutFunction): SlangArmedFunction => (
    mkArmedFunction((args, ctx) => {
        if (func.params !== args.length) {
            throw new SlangArityError('f')
        }

        return execute(
            func.body,
            joinEnvs(ctx, createNumberedEnv(
                args.map(t => execute(t, ctx)),
            )),
        )
    })
)
