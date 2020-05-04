import type {
    Slang,
} from '../types'

import {
    SlangType,
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
        case SlangType.List:
            const resolvedHead = execute(expr.head, ctx)
            return fire(resolvedHead, ctx, expr.tail)

        case SlangType.Symbol:
            return lookup.lookup(expr, ctx) ?? expr

        case SlangType.Optional:
            return mkOptional(expr.boxed
                ? execute(expr.boxed, ctx)
                : null)

        case SlangType.Vector:
            return mkVector(expr.members.map(v => execute(v, ctx)))

        case SlangType.Map:
            const newMap = new Map()

            for (const [key, value] of expr.table) {
                newMap.set(key, execute(value, ctx))
            }

            return mkMapDirect(newMap)

        case SlangType.Quoted:
            return expr.quoted

        case SlangType.Function:
            return armFunc(expr, ctx)

        case SlangType.ShcutFunction:
            return armShcut(expr, ctx)

        case SlangType.Def:
            lookup.globalDefine(expr.identifier, execute(expr.value, ctx))
            return mkUnit()

        case SlangType.Let:
            return execute(
                expr.body,
                lookup.joinEnvs(ctx, expr.bindings),
            )

        case SlangType.Do:
            let result: Slang = mkUnit()

            for (const e of expr.expressions) {
                result = execute(e, ctx)
            }

            return result

        case SlangType.If:
            const ifCond = coerce.toBool(execute(expr.condition, ctx))

            if (ifCond.value) {
                return execute(expr.thenClause, ctx)
            }

            return execute(expr.elseClause, ctx)

        case SlangType.Cond:
            for (const test of expr.tests) {
                if (coerce.toBool(execute(test[0], ctx)).value) {
                    return execute(test[1], ctx)
                }
            }

            return mkUnit()

        case SlangType.Case:
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

        case SlangType.For:
            return mkUnit()

        case SlangType.Doseq:
            return mkUnit()

        case SlangType.ThreadFirst:
            let tfresult = execute(expr.value, ctx)

            for (const pipe of expr.pipes) {
                tfresult = isList(pipe)
                    ? (pipe.tail.unshift(tfresult), execute(pipe, ctx))
                    : execute(mkList(pipe, [tfresult]), ctx)
            }

            return tfresult

        case SlangType.ThreadLast:
            let tlresult = execute(expr.value, ctx)

            for (const pipe of expr.pipes) {
                tlresult = isList(pipe)
                    ? (pipe.tail.push(tlresult), execute(pipe, ctx))
                    : execute(mkList(pipe, [tlresult]), ctx)
            }

            return tlresult

        default:
            // case SlangType.String:
            // case SlangType.Number:
            // case SlangType.Unit:
            // case SlangType.Bool:

            // case SlangType.Keyword:
            // case SlangType.Function:
            return expr
    }
}

export default execute
