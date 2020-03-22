import type {
    Slang,
    SlangAtom,
    SlangArmedFunction,
} from '../types'

import {
    mkAtom,
} from '../constructors'

import {
    apply,
} from './functions'

export const atom = ([value]: [Slang]): SlangAtom => {
    return mkAtom(value)
}

export const deref = ([atom]: [SlangAtom]): Slang => {
    return atom.atom
}

export const swapX = ([atom, headComp, ...otherComps]: [SlangAtom, SlangArmedFunction, ...Slang[]], ctx: Map<string, Slang>): SlangAtom => {
    const args = [deref([atom]), ...otherComps]

    const result = apply(headComp, args, ctx)
    atom.atom = result

    return atom
}

export const resetX = ([atom, val]: [SlangAtom, Slang]): SlangAtom => {
    atom.atom = val

    return atom
}
