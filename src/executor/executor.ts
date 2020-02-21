import type {
    Slang,
} from '../types'

import {
    SlangTypes,
} from '../types'

import {
    mkUnit,
} from '../constructors'

import * as lookup from './lookup'
import * as coerce from './coerce'

import { fire } from './functions'
import * as equality from './equality'

export const execute = function(expr: Slang, ctx: Map<string, Slang>): Slang {
    switch (expr.kind) {
        case SlangTypes.List:
            const resolvedHead = execute(expr.head, ctx)
            return fire(resolvedHead, expr.tail, ctx)

        case SlangTypes.Symbol:
            return lookup.lookup(expr, ctx) ?? expr

        case SlangTypes.Quoted:
            return expr.quoted

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

export default execute
