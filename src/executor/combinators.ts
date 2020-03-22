import {
    Slang,
    SlangArmedFunction,
} from '../types'

import {
    wrap,
    arm,
} from './functions'

import {
    typecheck,
} from './exception'

export const identity = ([val]: [Slang]): Slang => {
    return val
}

export const constant2 = ([val, _throwaway]: [Slang, Slang]): Slang => {
    return val
}

const constant1 = ([val]: [Slang], ctx: Map<string, Slang>): SlangArmedFunction => {
    return arm(wrap('constant1', () => val)(ctx), ctx)
}

export const wrappedIdentity = wrap('identity', typecheck({
    f: identity,
    argc: (count) => count === 1,
}))

export const wrappedConstant = wrap('constant', typecheck({
    inf: (args) => args.length == 2
        ? constant2
        : constant1,
    argc: (count) => count <= 2,
}))
