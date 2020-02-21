import type {
    Slang,
    SlangSymbol,
} from '../types'

import {
    isNumber,
    isMap,
    isMapKey,
    isExecutable,
} from '../reflection'

import {
    wrap,
} from './functions'

import {
    typecheck,
} from './exception'

import * as equality from './equality'
import * as bool from './bool'
import * as math from './math'
import * as map from './map'
import * as higherorder from './higherorder'

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
    switch (key.value) {
        case '=':
            return wrap(typecheck('=', equality.equality, {}))
        case 'not=':
            return wrap(equality.unequality)

        case 'not':
            return wrap(bool.not)
        case 'and':
            return wrap(bool.and)
        case 'or':
            return wrap(bool.or)

        case '+':
            return wrap(typecheck('+', math.addition, {
                args: (args) => args.every(isNumber),
            }))
        case '-':
            return wrap(typecheck('-', math.subtraction, {
                argc: (count) => count > 0,
                args: (args) => args.every(isNumber),
            }))
        case '*':
            return wrap(typecheck('*', math.multiplication, {
                args: (args) => args.every(isNumber),
            }))
        case '/':
            return wrap(typecheck('/', math.division, {
                argc: (count) => count > 0,
                args: (args) => args.every(isNumber),
            }))


        case '<':
            return wrap(typecheck('<', math.lt, {
                argc: (count) => count > 0,
                args: (args) => args.every(isNumber),
            }))
        case '<=':
            return wrap(typecheck('<=', math.le, {
                argc: (count) => count > 0,
                args: (args) => args.every(isNumber),
            }))
        case '>':
            return wrap(typecheck('>', math.gt, {
                argc: (count) => count > 0,
                args: (args) => args.every(isNumber),
            }))
        case '>=':
            return wrap(typecheck('>=', math.ge, {
                argc: (count) => count > 0,
                args: (args) => args.every(isNumber),
            }))

        case 'merge':
            return wrap(typecheck('merge', map.merge, {
                argc: (count) => count >= 1,
                args: (args) => args.every(isMap),
            }))
        case 'merge-with':
            return wrap(typecheck('merge-with', map.mergeWith, {
                argc: (count) => count >= 2,
                arg0: (arg) => isExecutable(arg),
                args: (args) => args.slice(1).every(isMap),
            }))
        case 'assoc':
            return wrap(typecheck('assoc', map.assoc, {
                argc: (count) => count >= 1,
                arg0: (v) => isMap(v),
                args: (args) => args
                    .filter((_v, i) => i > 1 && i % 2 === 1)
                    .every(v => isMapKey(v)),
            }))
        case 'dissoc':
            return wrap(typecheck('dissoc', map.dissoc, {
                argc: (count) => count >= 1,
                arg0: (v) => isMap(v),
                args: (args) => args
                    .filter((_v, i) => i > 1)
                    .every(v => isMapKey(v)),
            }))


        case 'map':
            return wrap(higherorder.map)

        default:
            return localLookup(ctx, key)
                ?? globalLookup(key)
                ?? key
    }
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

export const joinEnvs = (oldEnv: Map<string, Slang>, newEnv: Map<string, Slang>): Map<string, Slang> => {
    const resultEnv = new Map()

    oldEnv.forEach((v,k) => newEnv.has(k) ? null : resultEnv.set(k, v))
    newEnv.forEach((v,k) => resultEnv.set(k, v))

    return resultEnv
}
