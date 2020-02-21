import type {
    Slang,
    SlangAtom,
    SlangExecutable,
} from '../types'

import {
    mkAtom,
} from '../constructors'

import {
    fire,
} from './functions'

export const atom = ([value]: [Slang]): SlangAtom => {
    return mkAtom(value)
}

export const deref = ([atom]: [SlangAtom]): Slang => {
    return atom.atom
}

export const swap = ([atom, headComp, ...otherComps]: [SlangAtom, SlangExecutable, ...Slang[]], ctx: Map<string, Slang>) => {
    const args = [deref([atom]), ...otherComps]

    const result = fire(headComp, args, ctx)
    atom.atom = result

    return atom
}
