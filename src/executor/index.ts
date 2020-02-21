import {
    SlangTypes,
    SlangSymbol,
    SlangList,
    SlangFunction,
    Slang,
} from '../types'

import {
    isSymbol,
    isVector,
    mkList,
} from '../constructors'

import {
    SlangArityError,
    SlangTypeError,
} from './exception'

import * as math from './math'
import * as map from './map'
import * as vector from './vector'

import * as lookup from './lookup'
import * as functions from './functions'

export const execute = function(expr: Slang, ctx: Map<string, Slang>): Slang {
    switch (expr.kind) {
        case SlangTypes.List:
            return executeList(expr, ctx)

        case SlangTypes.Symbol:
            const lookedup = lookup.localLookup(expr, ctx)
            console.log('ll', expr, lookedup)

            return lookedup ? lookedup : expr

        default:
            // case SlangTypes.String:
            // case SlangTypes.Number:
            // case SlangTypes.Unit:
            // case SlangTypes.Bool:

            // case SlangTypes.Keyword:
            // case SlangTypes.Quoted:
            // case SlangTypes.Optional:

            // case SlangTypes.Vector:
            // case SlangTypes.Map:
            // case SlangTypes.Function:
            return expr
    }
}

const executeList = function(lst: SlangList, ctx: Map<string, Slang>) {
    switch (lst.head.kind) {
        case SlangTypes.Symbol:
            const resolve = resolveSymbol(lst.head, ctx) as (args: Slang[], ctx: Map<string, Slang>) => Slang

            return resolve(lst.tail, ctx)

        case SlangTypes.Vector:
            return vector.indexing(lst.head, lst.tail)
        case SlangTypes.Map:
            return map.indexing(lst.head, lst.tail)

        case SlangTypes.Function:
            console.log('foo2')
            return functions.executeFunction(lst.head, execute)(lst.tail, ctx)

        case SlangTypes.List:
            const evaluatedHead = execute(lst.head, ctx)
            const newList = mkList(evaluatedHead, lst.tail)
            console.log('foo', evaluatedHead)

            return executeList(newList, ctx)

        default:
            return null
    }
}

const builtin = (
    b: (a: Slang[]) => Slang,
) => (
    args: Slang[],
    ctx: Map<string, Slang>,
) => b(args.map(t => execute(t, ctx)))

const resolveSymbol = (head: SlangSymbol, ctx: Map<string, Slang>): (args: Slang[], ctx: Map<string, Slang>) => Slang => {

    const lookedup = lookup.localLookup(head, ctx)

    if (lookedup) {
        return (args, ctx) => execute(mkList(lookedup, args.map(t => execute(t, ctx))), ctx)
    }

    switch (head.value) {
        case 'def':
            return (args, ctx) => {
                if (args.length !== 2) {
                    throw new SlangArityError(args.length)
                }
                else if (!isSymbol(args[0])) {
                    throw new SlangTypeError('Value needs to be a symbol')
                }

                return lookup.globalDefine(args[0].value, execute(args[1], ctx))
            }

        case 'fn':
            return (args, _ctx) => functions.createFunction(args)

        case '+':
            return builtin(math.addition)
        case '-':
            return builtin(math.subtraction)
        case '*':
            return builtin(math.multiplication)

        default:
            return null
    }
}
