import type {
    Slang,
} from '../types'

import {
    SlangTypes,
} from '../types'

import {
    mkUnit,
    mkList,
    mkOptional,
    mkVector,
    mkMapDirect,
} from '../constructors'

import {
    isList,
} from '../reflection'

import * as lookup from './lookup'
import * as coerce from './coerce'

import {
    fire,
    armFunc,
    armShcut,
} from './functions'

import * as equality from './equality'

export const execute = function(expr: Slang, ctx: Map<string, Slang>): Slang {
    switch (expr.kind) {
        case SlangTypes.List:
            const resolvedHead = execute(expr.head, ctx)
            return fire(resolvedHead, expr.tail, ctx)

        case SlangTypes.Symbol:
            return lookup.lookup(expr, ctx) ?? expr

        case SlangTypes.Optional:
            return mkOptional(expr.boxed
                ? execute(expr.boxed, ctx)
                : null)

        case SlangTypes.Vector:
            return mkVector(expr.members.map(v => execute(v, ctx)))

        case SlangTypes.Map:
            const newMap = new Map()

            for (const [key, value] of expr.table) {
                newMap.set(key, execute(value, ctx))
            }

            return mkMapDirect(newMap)

        case SlangTypes.Quoted:
            return expr.quoted

        case SlangTypes.Function:
            return armFunc(expr, ctx)

        case SlangTypes.ShcutFunction:
            return armShcut(expr, ctx)

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

        case SlangTypes.For:
            return mkUnit()

        case SlangTypes.Doseq:
            return mkUnit()

        case SlangTypes.ThreadFirst:
            let tfresult = execute(expr.value, ctx)

            for (const pipe of expr.pipes) {
                tfresult = isList(pipe)
                    ? (pipe.tail.unshift(tfresult), execute(pipe, ctx))
                    : execute(mkList(pipe, [tfresult]), ctx)
            }

            return tfresult

        case SlangTypes.ThreadLast:
            let tlresult = execute(expr.value, ctx)

            for (const pipe of expr.pipes) {
                tlresult = isList(pipe)
                    ? (pipe.tail.push(tlresult), execute(pipe, ctx))
                    : execute(mkList(pipe, [tlresult]), ctx)
            }

            return tlresult

        default:
            // case SlangTypes.String:
            // case SlangTypes.Number:
            // case SlangTypes.Unit:
            // case SlangTypes.Bool:

            // case SlangTypes.Keyword:
            // case SlangTypes.Function:
            return expr
    }
}

export default execute
