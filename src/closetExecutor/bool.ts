import {
    Slang,
} from '../types'

import {
    mkBool,
} from '../constructors'

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
    const headArg = args[0]
    return mkBool(!toBool(headArg).value)
}
