import {
    Slang,
} from '../types'

import {
    mkBool,
} from '../constructors'

import {
    SlangArityError,
} from './exception'

import {
    toBool,
} from './coerce'

export const and = (args: Slang[]) => {
    let conj = true

    for (const arg of args) {
        conj = conj && toBool(arg).value
    }

    return mkBool(conj)
}

export const or = (args: Slang[]) => {
    let disj = false

    for (const arg of args) {
        disj = disj || toBool(arg).value
    }

    return mkBool(disj)
}

export const not = (args: Slang[]) => {
    if (args.length !== 1) {
        throw new SlangArityError('Maximum of 1 arg', 3)
    }

    const headArg = args[0]
    return mkBool(!toBool(headArg).value)
}
