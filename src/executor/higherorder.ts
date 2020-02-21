import type {
    Slang,
} from '../types'

import {
    SlangTypes,
} from '../types'

import {
    mkVector,
} from '../constructors'

import {
    SlangArityError,
    SlangTypeError,
} from './exception'

import * as functions from './functions'

import execute from './executor'

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
    if (!args[0]) {
        throw new SlangArityError(args.length)
    }

    const theFunction = args[0]
    const params = args.slice(1)

    for (const p of params) {
        if (p.kind !== SlangTypes.Vector) {
            throw new SlangTypeError(p.kind)
        }
    }

    //@ts-ignore
    const newParams = transpose(params.map(p => p.members))

    switch (theFunction.kind) {
        case SlangTypes.Function:
            if (theFunction.params.length !== params.length) {
                throw new SlangArityError(args.length)
            }

            const armedf = functions.armFunc(theFunction)
            return mkVector(newParams.map(np => armedf.apply(np, ctx)))

        case SlangTypes.ShcutFunction:
            if (theFunction.params !== params.length) {
                throw new SlangArityError(args.length)
            }

            const armeds = functions.armShcut(theFunction)
            return mkVector(newParams.map(np => armeds.apply(np, ctx)))

        case SlangTypes.ArmedFunction:
            return mkVector(newParams.map(np => theFunction.apply(np, ctx)))
        default:
            throw new SlangTypeError('Not executable')
    }
}
