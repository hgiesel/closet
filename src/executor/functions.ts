import {
    Slang,
    SlangFunction,
} from '../types'

import {
    createLocalEnv,
    joinEnvs,
} from './lookup'

export const executeFunction = (
    func: SlangFunction,
    exec: (s: Slang, ctx: Map<string, Slang>) => Slang,
) => (
    args: Slang[],
    outerCtx: Map<string, Slang>,
): Slang => {
    return exec(
        func.body,
        joinEnvs(outerCtx, createLocalEnv(func.params, args)),
    )
}
