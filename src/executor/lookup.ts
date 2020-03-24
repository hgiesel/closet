import type {
    Slang,
    SlangSymbol,
} from '../types'

import fixedTable from './fixed-table'

const globalTable = new Map()

export const globalDefine = (key: SlangSymbol, value: Slang): void => {
    globalTable.set(key.value, value)
}

const globalLookup = (key: SlangSymbol): Slang | null => {
    return globalTable.has(key.value)
        ? globalTable.get(key.value)
        : null
}

const localLookup = (ctx: Map<string, Slang>, key: SlangSymbol): Slang | null => {
    return ctx.has(key.value)
        ? ctx.get(key.value)
        : null
}

export const lookup = (key: SlangSymbol, ctx: Map<string, Slang>): Slang => {
    return fixedTable[key.value]
        ? fixedTable[key.value](ctx)
        : localLookup(ctx, key) ?? globalLookup(key) ?? key
}

export const createEnv = (params: SlangSymbol[], args: Slang[]): Map<string, Slang> => {
    const env = new Map()
    params.forEach((v, i) => env.set(v.value, args[i]))

    return env
}

export const createNumberedEnv = (args: Slang[]): Map<string, Slang> => {
    const env = new Map()

    if (args.length > 0) {
        env.set(`%`, args[0])
    }

    args.forEach((v, i) => env.set(`%${i+1}`, v))

    return env
}

export const joinEnvs = (...envs: Map<string, Slang>[]): Map<string, Slang> => {
    const resultEnv = new Map()

    for (const env of envs) {
        for (const [key, value] of env) {
            resultEnv.set(key, value)
        }
    }

    return resultEnv
}
