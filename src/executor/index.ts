import {
    SlangTypes,
    SlangSymbol,
    SlangList,
    Slang,
} from '../types'

import {
    mkList,
    mkUnit,
} from '../constructors'

import * as math from './math'
import * as bool from './bool'
import * as equality from './equality'
import * as map from './map'
import * as vector from './vector'

import * as coerce from './coerce'
import * as lookup from './lookup'
import * as functions from './functions'

export const execute = function(expr: Slang, ctx: Map<string, Slang>): Slang {
    console.log(expr)
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
            return functions.executeFunction(lst.head, execute)(lst.tail, ctx)

        case SlangTypes.ShcutFunction:
            return functions.executeShcutFunction(lst.head, execute)(lst.tail, ctx)

        case SlangTypes.List:
            const evaluatedHead = execute(lst.head, ctx)
            const newList = mkList(evaluatedHead, lst.tail)

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
    const lookedup = lookup.lookup(head, ctx)

    if (lookedup) {
        return (args, ctx) => execute(mkList(lookedup, args.map(t => execute(t, ctx))), ctx)
    }

    switch (head.value) {
        case '=':
            return builtin(equality.equality)
        case 'not=':
            return builtin(equality.unequality)

        case 'not':
            return builtin(bool.not)
        case 'and':
            return builtin(bool.and)
        case 'or':
            return builtin(bool.or)


        case '+':
            return builtin(math.addition)
        case '-':
            return builtin(math.subtraction)
        case '*':
            return builtin(math.multiplication)
        case '/':
            return builtin(math.division)

        default:
            return null
    }
}
