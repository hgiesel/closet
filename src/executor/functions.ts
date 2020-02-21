import {
    Slang,
    SlangFunction,
    SlangSymbol,
} from '../types'

import {
    mkFunction,
    isVector,
} from '../constructors'

import {
    SlangArityError,
    SlangTypeError,
} from './exception'

import {
    createLocalEnv,
    joinEnvs,
} from './lookup'

export const createFunction = (tail: Slang[]): SlangFunction => {
    if (tail.length !== 2) {
        throw new SlangArityError(tail.length)
    }
    else if (!isVector(tail[0])) {
        throw new SlangTypeError('Parameter list needs to be a vector')
    }

    return mkFunction(tail[0].members as SlangSymbol[], tail[1])
}

export const executeFunction = (
    func: SlangFunction,
    exec: (s: Slang, ctx: Map<string, Slang>) => Slang,
) => (
    args: Slang[],
    outerCtx: Map<string, Slang>,
): Slang => {
    console.log('foo3', func, exec, args, outerCtx)
    console.log('meh1',createLocalEnv(func.params, args))
    console.log('meh2',joinEnvs(outerCtx, createLocalEnv(func.params, args)))
    return exec(
        func.body,
        joinEnvs(outerCtx, createLocalEnv(func.params, args)),
    )
}
