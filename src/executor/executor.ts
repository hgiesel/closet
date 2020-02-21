import type {
    SlangSymbol,
    SlangList,
    Slang,
} from '../types'

import {
    SlangTypes,
} from '../types'

import {
    mkUnit,
} from '../constructors'

import * as higherorder from './higherorder'

import * as lookup from './lookup'
import * as coerce from './coerce'

import * as functions from './functions'
import * as map from './map'

import * as vector from './vector'
import * as equality from './equality'

export const execute = function(expr: Slang, ctx: Map<string, Slang>): Slang {
    switch (expr.kind) {
        case SlangTypes.List:
            return executeList(expr, ctx)

        case SlangTypes.Symbol:
            return lookup.lookup(expr, ctx) ?? expr

        case SlangTypes.Def:
            lookup.globalDefine(expr.identifier, execute(expr.value, ctx))
            return mkUnit()

        case SlangTypes.Let:
            return execute(
                expr.body,
                lookup.joinEnvs(ctx, expr.bindings),
            )

        case SlangTypes.Do:
            let result: Slang = mkUnit()

            for (const e of expr.expressions) {
                result = execute(e, ctx)
            }

            return result

        case SlangTypes.If:
            const ifCond = coerce.toBool(execute(expr.condition, ctx))

            if (ifCond.value) {
                return execute(expr.thenClause, ctx)
            }

            return execute(expr.elseClause, ctx)

        case SlangTypes.Cond:
            for (const test of expr.tests) {
                if (coerce.toBool(execute(test[0], ctx)).value) {
                    return execute(test[1], ctx)
                }
            }

            return mkUnit()

        case SlangTypes.Case:
            expr.variable
            for (const [test, then] of expr.tests) {
                if (equality.equality([
                    execute(expr.variable, ctx),
                    test,
                ]).value) {
                    return execute(then, ctx)
                }
            }

            return mkUnit()

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
            // case SlangTypes.ShcutFunction:
            // case SlangTypes.ArmedFunction:
            return expr
    }
}

const executeList = function(lst: SlangList, ctx: Map<string, Slang>) {
    const resolvedHead = execute(lst.head, ctx)

    switch (resolvedHead.kind) {
        case SlangTypes.Function:
            return functions.armFunc(resolvedHead).apply(lst.tail, ctx)

        case SlangTypes.ShcutFunction:
            return functions.armShcut(resolvedHead).apply(lst.tail, ctx)

        case SlangTypes.ArmedFunction:
            return resolvedHead.apply(lst.tail, ctx)

        case SlangTypes.Vector:
            return vector.indexing(resolvedHead, lst.tail)

        case SlangTypes.Map:
            return map.indexing(resolvedHead, lst.tail)

        default:
            return null
    }
}

export default execute
