import * as equality from './equality'

import {
    wrap,
} from './functions'

import {
    typecheck,
} from './exception'

import {
    isNumber,
    isMap,
    isMapKey,
    isExecutable,
} from '../reflection'

import * as bool from './bool'
import * as math from './math'
import * as map from './map'
import * as higherorder from './higherorder'

export const fixedTable = {
    '=': wrap('=', typecheck(equality.equality, {
        argc: (count) => count > 0,
    })),
    'not=': wrap('not=', typecheck(equality.unequality, {
        argc: (count) => count > 0,
    })),

    'not': wrap('not', typecheck(bool.not, {
        argc: (count) => count === 1,
    })),
    'and': wrap('and', bool.and),
    'or': wrap('or', bool.or),

    '+': wrap('+', typecheck(math.addition, {
        args: (args) => args.every(isNumber),
    })),
    '-': wrap('-', typecheck(math.subtraction, {
        argc: (count) => count > 0,
        args: (args) => args.every(isNumber),
    })),
    '*': wrap('*', typecheck(math.multiplication, {
        args: (args) => args.every(isNumber),
    })),
    '/': wrap('/', typecheck(math.division, {
        argc: (count) => count > 0,
        args: (args) => args.every(isNumber),
    })),


    '<': wrap('<', typecheck(math.lt, {
        argc: (count) => count > 0,
        args: (args) => args.every(isNumber),
    })),
    '<=': wrap('<=', typecheck(math.le, {
        argc: (count) => count > 0,
        args: (args) => args.every(isNumber),
    })),
    '>': wrap('>', typecheck(math.gt, {
        argc: (count) => count > 0,
        args: (args) => args.every(isNumber),
    })),
    '>=': wrap('>=', typecheck(math.ge, {
        argc: (count) => count > 0,
        args: (args) => args.every(isNumber),
    })),

    'merge': wrap('merge', typecheck(map.merge, {
        argc: (count) => count >= 1,
        args: (args) => args.every(isMap),
    })),
    'merge-with': wrap('merge-with', typecheck(map.mergeWith, {
        argc: (count) => count >= 2,
        arg0: (arg) => isExecutable(arg),
        args: (args) => args.slice(1).every(isMap),
    })),
    'assoc': wrap('assoc', typecheck(map.assoc, {
        argc: (count) => count >= 1,
        arg0: (v) => isMap(v),
        args: (args) => args
        .filter((_v, i) => i > 1 && i % 2 === 1)
        .every(v => isMapKey(v)),
    })),
    'dissoc': wrap('dissoc', typecheck(map.dissoc, {
        argc: (count) => count >= 1,
        arg0: (v) => isMap(v),
        args: (args) => args
        .filter((_v, i) => i > 1)
        .every(v => isMapKey(v)),
    })),


    'map': wrap('map', higherorder.map),
}

export default fixedTable
