import type {
    Slang,
    SlangExecutable,
    SlangMappable,
} from '../types'

import {
    mkVector,
} from '../constructors'

import { arm, apply } from './functions'

const transpose = (arrs: any[][]) => {
    const result = arrs.length === 0
        ? []
        : arrs[0].map(_ => [])

    arrs.map(fst => fst.map((snd, i) => {
        result[i].push(snd)
    }))

    return result
}

export const map = ([func, ...params]: [SlangExecutable, ...SlangMappable[]], ctx: Map<string, Slang>) => {
    // const newParams = transpose(params.map(p => p.members))

    // const armed = arm(func)

    return mkVector([])
    // return mkVector(newParams.map(np => apply(armed, np, ctx)))
}

