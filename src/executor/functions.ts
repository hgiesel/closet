import {
    Slang,
    SlangFunction,
    SlangShcutFunction,
} from '../types'

import {
    createEnv,
    createNumberedEnv,
    joinEnvs,
} from './lookup'

import {
    SlangArityError,
} from './exception'

export const executeFunction = (
    func: SlangFunction,
    exec: (s: Slang, ctx: Map<string, Slang>) => Slang,
) => (
    args: Slang[],
    outerCtx: Map<string, Slang>,
): Slang => {
    if (func.params.length !== args.length) {
        throw new SlangArityError('f')
    }

    return exec(
        func.body,
        joinEnvs(outerCtx, createEnv(func.params, args)),
    )
}

export const executeShcutFunction = (
    func: SlangShcutFunction,
    exec: (s: Slang, ctx: Map<string, Slang>) => Slang,
) => (
    args: Slang[],
    outerCtx: Map<string, Slang>,
): Slang => {
    if (func.params !== args.length) {
        throw new SlangArityError('f')
    }

    return exec(
        func.body,
        joinEnvs(outerCtx, createNumberedEnv(args)),
    )
}
