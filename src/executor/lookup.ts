import {
    Slang,
    SlangSymbol,
} from '../types'

export const localLookup = (key: SlangSymbol, ctx: Map<string, Slang>): Slang | null => {
    return ctx.has(key.value)
        ? ctx.get(key.value)
        : null
}

export const createLocalEnv = (params: SlangSymbol[], args: Slang[]): Map<string, Slang> => {
    const localEnv = new Map()

    params.forEach((v, i) => localEnv.set(v.value, args[i]))

    return localEnv
}

export const joinEnvs = (oldEnv: Map<string, Slang>, newEnv: Map<string, Slang>): Map<string, Slang> => {
    const resultEnv = new Map()

    oldEnv.forEach((v,k) => newEnv.has(k) ? null : resultEnv.set(k, v))
    newEnv.forEach((v,k) => resultEnv.set(k, v))

    return resultEnv
}
