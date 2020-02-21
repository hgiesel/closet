import type {
    Slang,
} from '../types'

import {
    mkVector,
} from '../constructors'

import * as functions from './functions'

const transpose = (arrs: any[][]) => {
    const result = arrs.length === 0
        ? []
        : arrs[0].map(_ => [])

    arrs.map(fst => fst.map((snd, i) => {
        result[i].push(snd)
    }))

    return result
}

export const map = (args: Slang[], ctx: Map<string, Slang>) => {
    const theFunction = args[0]
    const params = args.slice(1)

    //@ts-ignore
    const newParams = transpose(params.map(p => p.members))

    const armed = functions.arm('fo', theFunction)
    return mkVector(newParams.map(np => armed.apply(np, ctx)))
}
