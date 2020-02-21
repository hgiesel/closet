import * as equality from './equality'

import {
    wrap,
} from './functions'

import {
    typecheck,
} from './exception'

import {
    isNumber,
    isAtom,
    isMap,
    isVector,
    isList,
    isOptional,
    isMapKey,
    isExecutable,
} from '../reflection'

import * as bool from './bool'
import * as math from './math'
import * as map from './map'
import * as atoms from './atoms'
import * as higherorder from './higherorder'
import * as seq from './seq'

export const fixedTable = {
    '=': wrap('=', typecheck({
        f: equality.equality,
        argc: (count) => count > 0,
    })),
    'not=': wrap('not=', typecheck({
        f: equality.unequality,
        argc: (count) => count > 0,
    })),

    'not': wrap('not', typecheck({
        f: bool.not,
        argc: (count) => count === 1,
    })),
    'and': wrap('and', bool.and),
    'or': wrap('or', bool.or),

    '+': wrap('+', typecheck({
        f: math.addition,
        args: (args) => args.every(isNumber),
    })),
    '-': wrap('-', typecheck({
        f: math.subtraction,
        argc: (count) => count > 0,
        args: (args) => args.every(isNumber),
    })),
    '*': wrap('*', typecheck({
        f: math.multiplication,
        args: (args) => args.every(isNumber),
    })),
    '/': wrap('/', typecheck({
        f: math.division,
        argc: (count) => count > 0,
        args: (args) => args.every(isNumber),
    })),


    '<': wrap('<', typecheck({
        f: math.lt,
        argc: (count) => count > 0,
        args: (args) => args.every(isNumber),
    })),
    '<=': wrap('<=', typecheck({
        f: math.le,
        argc: (count) => count > 0,
        args: (args) => args.every(isNumber),
    })),
    '>': wrap('>', typecheck({
        f: math.gt,
        argc: (count) => count > 0,
        args: (args) => args.every(isNumber),
    })),
    '>=': wrap('>=', typecheck({
        f: math.ge,
        argc: (count) => count > 0,
        args: (args) => args.every(isNumber),
    })),

    'merge': wrap('merge', typecheck({
        f: map.merge,
        argc: (count) => count >= 1,
        args: (args) => args.every(isMap),
    })),
    'merge-with': wrap('merge-with', typecheck({
        f: map.mergeWith,
        argc: (count) => count >= 2,
        arg0: (arg) => isExecutable(arg),
        args: (args) => args.slice(1).every(isMap),
    })),
    'get': wrap('get', typecheck({
        f: seq.getFunc,
        argc: (count) => count === 3,
        args: ([seqArg, idxArg]) =>
            (isMap(seqArg) && isMapKey(idxArg)) ||
            (isVector(seqArg) && isNumber(idxArg)) ||
            (isList(seqArg) && isNumber(idxArg)) ||
            (isOptional(seqArg) && isNumber(idxArg))
    })),
    'contains?': wrap('contains?', typecheck({
        f: map.containsQ,
        argc: (count) => count === 2,
        arg0: (arg) => isMap(arg),
        arg1: (arg) => isMapKey(arg),
    })),
    'find': wrap('find', typecheck({
        f: map.find,
        argc: (count) => count === 2,
        arg0: (arg) => isMap(arg),
        arg1: (arg) => isMapKey(arg),
    })),
    'keys': wrap('keys', typecheck({
        f: map.keys,
        argc: (count) => count === 1,
        arg0: (arg) => isMap(arg),
    })),
    'vals': wrap('vals', typecheck({
        f: map.vals,
        argc: (count) => count === 1,
        arg0: (arg) => isMap(arg),
    })),

    'assoc': wrap('assoc', typecheck({
        f: map.assoc,
        argc: (count) => count >= 1,
        arg0: (v) => isMap(v),
        args: (args) => args
        .filter((_v, i) => i > 1 && i % 2 === 1)
        .every(v => isMapKey(v)),
    })),
    'dissoc': wrap('dissoc', typecheck({
        f: map.dissoc,
        argc: (count) => count >= 1,
        arg0: (v) => isMap(v),
        args: (args) => args
        .filter((_v, i) => i > 1)
        .every(v => isMapKey(v)),
    })),


    'atom': wrap('atom', typecheck({
        f: atoms.atom,
        argc: (count) => count === 1,
    })),
    'deref': wrap('deref', typecheck({
        f: atoms.deref,
        argc: (count) => count === 1,
        arg0: (val) => isAtom(val),
    })),
    'swap!': wrap('swap!', typecheck({
        f: atoms.swapX,
        argc: (count) => count >= 2,
        arg0: (val) => isAtom(val),
        arg1: (val) => isExecutable(val),
    })),
    'reset!': wrap('reset!', typecheck({
        f: atoms.resetX,
        argc: (count) => count === 2,
        arg0: (val) => isAtom(val),
    })),

    'map': wrap('map', higherorder.map),
}

export default fixedTable
