import type {
    Slang,
    SlangArmedFunction,
} from '../types'

import {
    OpticType,
} from '../types'

import {
    wrap,
} from './functions'

import {
    typecheck,
} from './exception'

import {
    isNumber,
    isAtom,
    isString,
    isMap,
    isVector,
    isList,
    isOptional,
    isMapKey,
    isExecutable,
    isArmedFunction,
    isOptic,
    isOpticCoercable,
} from '../reflection'

import * as combinators from './combinators'
import * as equality from './equality'
import * as bool from './bool'
import * as math from './math'
import * as map from './map'
import * as atoms from './atoms'
import * as seq from './seq'
import * as random from './random'
import * as strings from './strings'
import * as optic from './optic'

import {
    opticLE,
} from './optic-helper'

export const fixedTable: {[key: string]: (ctx: Map<string, Slang>) => SlangArmedFunction} = {
    /////////////////// COMBINATORS
    'identity': combinators.wrappedIdentity,
    'constant': combinators.wrappedConstant,

    /////////////////// EQUALITY
    '=': wrap('=', typecheck({
        f: equality.equality,
        argc: (count) => count > 0,
    })),
    'not=': wrap('not=', typecheck({
        f: equality.unequality,
        argc: (count) => count > 0,
    })),

    /////////////////// EQUALITY
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

    'min': wrap('min', typecheck({
        f: math.min,
        argc: (count) => count > 0,
        args: (args) => args.every(isNumber),
    })),
    'max': wrap('max', typecheck({
        f: math.max,
        argc: (count) => count > 0,
        args: (args) => args.every(isNumber),
    })),

    'round': wrap('round', typecheck({
        f: math.round,
        argc: (count) => count === 1,
        args: (args) => isNumber(args[0]),
    })),
    'floor': wrap('floor', typecheck({
        f: math.floor,
        argc: (count) => count === 1,
        args: (args) => isNumber(args[0]),
    })),
    'ceil': wrap('ceil', typecheck({
        f: math.ceil,
        argc: (count) => count === 1,
        args: (args) => isNumber(args[0]),
    })),

    'even?': wrap('even?', typecheck({
        f: math.evenQ,
        argc: (count) => count === 1,
        args: (args) => isNumber(args[0]),
    })),
    'odd?': wrap('odd?', typecheck({
        f: math.oddQ,
        argc: (count) => count === 1,
        args: (args) => isNumber(args[0]),
    })),

    'pos?': wrap('pos?', typecheck({
        f: math.posQ,
        argc: (count) => count === 1,
        args: (args) => isNumber(args[0]),
    })),
    'neg?': wrap('neg?', typecheck({
        f: math.negQ,
        argc: (count) => count === 1,
        args: (args) => isNumber(args[0]),
    })),

    ////////////////// RANDOM
    'rand': wrap('rand', typecheck({
        f: random.rand,
        argc: (count) => count <= 2,
        args: (args) => args.every(isNumber),
    })),
    'rand-int': wrap('rand-int', typecheck({
        f: random.randInt,
        argc: (count) => count <= 2,
        args: (args) => args.every(isNumber),
    })),

    'rand-nth': wrap('rand-nth', typecheck({
        f: random.randNth,
        argc: (count) => count === 1,
        args: (args) => isVector(args[0]),
    })),
    'shuffle': wrap('shuffle', typecheck({
        f: random.shuffle,
        argc: (count) => count === 1,
        args: (args) => isVector(args[0]),
    })),


    ////////////////// HASH MAPS
    'hash-map': wrap('hash-map', typecheck({
        f: map.hashMap,
        args: (args) => args
        .filter((_v, i) => i % 2 === 0)
        .every(v => isMapKey(v)),
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

    'vector': wrap('vector', seq.Vector.vector),
    'list': wrap('list', seq.List.list),
    'optional': wrap('optional', typecheck({
        f: seq.Optional.optional,
        argc: (count) => count <= 1,
    })),

    // 'get': wrap('get', typecheck({
    //     inf: (args) => isMap(args[0])
    //         ? seq.Map.getFunc
    //         : isVector(args[0])
    //         ? seq.Vector.getFunc
    //         : isList(args[0])
    //         ? seq.List.getFunc
    //         : seq.Optional.getFunc,
    //     argc: (count) => count === 3,
    //     args: ([seqArg, idxArg]) =>
    //         (isMap(seqArg) && isMapKey(idxArg)) ||
    //         (isVector(seqArg) && isNumber(idxArg)) ||
    //         (isList(seqArg) && isNumber(idxArg)) ||
    //         (isOptional(seqArg) && isBool(idxArg))
    // })),

    'take': wrap('take', typecheck({
        inf: (args) => isMap(args[1])
            ? seq.Map.take
            : isVector(args[1])
            ? seq.Vector.take
            : seq.List.take,
        argc: (count) => count === 2,
        args: ([count, seqArg]) =>
            (isMap(seqArg) && isNumber(count)) ||
            (isVector(seqArg) && isNumber(count)) ||
            (isList(seqArg) && isNumber(count))
    })),
    'take-while': wrap('take-while', typecheck({
        inf: (args) => isMap(args[1])
            ? seq.Map.takeWhile
            : isVector(args[1])
            ? seq.Vector.takeWhile
            : seq.List.takeWhile,
        argc: (count) => count === 2,
        args: ([func, seqArg]) =>
            (isMap(seqArg) && isArmedFunction(func)) ||
            (isVector(seqArg) && isExecutable(func)) ||
            (isList(seqArg) && isExecutable(func))
    })),

    'drop': wrap('drop', typecheck({
        inf: (args) => isMap(args[1])
            ? seq.Map.drop
            : isVector(args[1])
            ? seq.Vector.drop
            : seq.List.drop,
        argc: (count) => count === 2,
        args: ([count, seqArg]) =>
            (isMap(seqArg) && isNumber(count)) ||
            (isVector(seqArg) && isNumber(count)) ||
            (isList(seqArg) && isNumber(count))
    })),
    'drop-while': wrap('drop-while', typecheck({
        inf: (args) => isMap(args[1])
            ? seq.Map.dropWhile
            : isVector(args[1])
            ? seq.Vector.dropWhile
            : seq.List.dropWhile,
        argc: (count) => count === 2,
        args: ([func, seqArg]) =>
            (isMap(seqArg) && isExecutable(func)) ||
            (isVector(seqArg) && isExecutable(func)) ||
            (isList(seqArg) && isExecutable(func))
    })),

    'count': wrap('count', typecheck({
        inf: (args) => isMap(args[0])
            ? seq.Map.count
            : isVector(args[0])
            ? seq.Vector.count
            : isList(args[0])
            ? seq.List.count
            : seq.Optional.count,
        argc: (count) => count === 1,
        args: ([seqArg]) =>
            isMap(seqArg) ||
            isVector(seqArg) ||
            isList(seqArg) ||
            isOptional(seqArg),
    })),
    'empty?': wrap('empty?', typecheck({
        inf: (args) => isMap(args[0])
            ? seq.Map.emptyQ
            : isVector(args[0])
            ? seq.Vector.emptyQ
            : isList(args[0])
            ? seq.List.emptyQ
            : seq.Optional.emptyQ,
        argc: (count) => count === 1,
        args: ([seqArg]) =>
            isMap(seqArg) ||
            isVector(seqArg) ||
            isList(seqArg)  ||
            isOptional(seqArg),
    })),

    'every?': wrap('every?', typecheck({
        inf: (args) => isMap(args[1])
            ? seq.Map.everyQ
            : isVector(args[1])
            ? seq.Vector.everyQ
            : isList(args[1])
            ? seq.List.everyQ
            : seq.Optional.everyQ,
        argc: (count) => count === 2,
        args: ([pred, seqArg]) =>
        (isExecutable(pred) && isMap(seqArg)) ||
        (isExecutable(pred) && isVector(seqArg)) ||
        (isExecutable(pred) && isList(seqArg)) ||
        (isExecutable(pred) && isOptional(seqArg)),
    })),
    'any?': wrap('any?', typecheck({
        inf: (args) => isMap(args[1])
            ? seq.Map.anyQ
            : isVector(args[1])
            ? seq.Vector.anyQ
            : isList(args[1])
            ? seq.List.anyQ
            : seq.Optional.anyQ,
        argc: (count) => count === 2,
        args: ([pred, seqArg]) => (
            isExecutable(pred) && (
                isMap(seqArg) ||
                isVector(seqArg) ||
                isList(seqArg)  ||
                isOptional(seqArg)
            )),
    })),

    'map': wrap('map', typecheck({
        inf: (args) => isMap(args[1])
            ? seq.Map.map
            : isVector(args[1])
            ? seq.Vector.map
            : isList(args[1])
            ? seq.List.map
            : seq.Optional.map,
        argc: (count) => count >= 2,
        args: ([pred, ...seqArgs]) => (
            isExecutable(pred) && (
                seqArgs.every(isMap) ||
                seqArgs.every(isVector) ||
                seqArgs.every(isList) ||
                seqArgs.every(isOptional)
            ))
    })),

    'filter': wrap('filter', typecheck({
        inf: (args) => isMap(args[1])
            ? seq.Map.filter
            : isVector(args[1])
            ? seq.Vector.filter
            : isList(args[1])
            ? seq.List.filter
            : seq.Optional.filter,
        argc: (count) => count === 2,
        args: ([pred, seqArg]) => (
            isExecutable(pred) && (
                isMap(seqArg) ||
                isVector(seqArg) ||
                isList(seqArg) ||
                isOptional(seqArg)
            ))
    })),

    'reduce': wrap('reduce', typecheck({
        inf: (args) => isMap(args[2])
            ? seq.Map.foldl
            : isVector(args[2])
            ? seq.Vector.foldl
            : isList(args[2])
            ? seq.List.foldl
            : seq.Optional.foldl,
        argc: (count) => count === 3,
        args: ([pred,,seqArg]) => (
            isExecutable(pred) && (
                isMap(seqArg) ||
                isVector(seqArg) ||
                isList(seqArg) ||
                isOptional(seqArg)
            ))
    })),
    'foldl': wrap('foldl', typecheck({
        inf: (args) => isMap(args[2])
            ? seq.Map.foldl
            : isVector(args[2])
            ? seq.Vector.foldl
            : isList(args[2])
            ? seq.List.foldl
            : seq.Optional.foldl,
        argc: (count) => count === 3,
        args: ([pred,, seqArg]) => (
            isExecutable(pred) && (
                isMap(seqArg) ||
                isVector(seqArg) ||
                isList(seqArg) ||
                isOptional(seqArg)
            ))
    })),

    'foldr': wrap('foldr', typecheck({
        inf: (args) => isMap(args[2])
            ? seq.Map.foldr
            : isVector(args[2])
            ? seq.Vector.foldr
            : isList(args[2])
            ? seq.List.foldr
            : seq.Optional.foldr,
        argc: (count) => count === 3,
        args: ([pred,,seqArg]) => (
            isExecutable(pred) && (
                isMap(seqArg) ||
                isVector(seqArg) ||
                isList(seqArg) ||
                isOptional(seqArg)
            ))
    })),

    'fzip': wrap('fzip', typecheck({
        inf: (args) => isVector(args[0])
            ? seq.Vector.fzip
            : seq.Optional.fzip,
        argc: (count) => count >= 1,
        args: ([...seqArg]) => (
            seqArg.every(isVector) ||
            seqArg.every(isOptional)
        )
    })),

    'flat': wrap('flat', typecheck({
        inf: (args) => isVector(args[0])
            ? seq.Vector.flat
            : isList(args[0])
            ? seq.List.flat
            : seq.Optional.flat,
        argc: (count) => count === 1,
        args: ([seqArg]) => (
            isVector(seqArg) ||
            isList(seqArg) ||
            isOptional(seqArg)
        )
    })),

    'bind': wrap('bind', typecheck({
        inf: (args) => isVector(args[1])
            ? seq.Vector.bind
            : seq.Optional.bind,
        argc: (count) => count >= 2,
        args: ([func, ...seqArgs]) => (
            isExecutable(func) &&
            seqArgs.every(isVector) ||
            // isList(seqArg) ||
            seqArgs.every(isOptional)
        )
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


    /////////////////// ATOMS
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

    /////////////////// STRINGS
    'starts-with?': wrap('starts-with?', typecheck({
        inf: (args) => isString(args[0])
            ? strings.String.startsWithQ
            : strings.Vector.startsWithQ,
        argc: (count) => count === 2,
        args: (args) => args.every(isString) || args.every(isVector),
    })),
    'ends-with?': wrap('ends-with?', typecheck({
        inf: (args) => isString(args[0])
            ? strings.String.endsWithQ
            : strings.Vector.endsWithQ,
        argc: (count) => count === 2,
        args: (args) => args.every(isString) || args.every(isVector)
    })),
    'includes?': wrap('includes?', typecheck({
        inf: (args) => isString(args[0])
            ? strings.String.includesQ
            : strings.Vector.includesQ,
        argc: (count) => count >= 2,
        args: (args) => args.every(isString) || args.every(isVector)
    })),
    'reverse': wrap('reverse', typecheck({
        inf: (args) => isString(args[0])
            ? strings.String.reverse
            : strings.Vector.reverse,
        argc: (count) => count === 1,
        args: (args) => isString(args[0]) || isVector(args[0])
    })),
    'join': wrap('join', typecheck({
        f: strings.String.join,
        argc: (count) => count === 2,
        args: (args) => isString(args[0]) || isVector(args[1]),
    })),


    'blank?': wrap('blank?', typecheck({
        f: strings.String.blankQ,
        argc: (count) => count === 1,
        args: (args) => isString(args[0]),
    })),
    'capitalize': wrap('capitalize', typecheck({
        f: strings.String.capitalize,
        argc: (count) => count === 1,
        args: (args) => isString(args[0]),
    })),
    'lower-case': wrap('lower-case', typecheck({
        f: strings.String.lowerCase,
        argc: (count) => count === 1,
        args: (args) => isString(args[0]),
    })),
    'upper-case': wrap('upper-case', typecheck({
        f: strings.String.upperCase,
        argc: (count) => count === 1,
        args: (args) => isString(args[0]),
    })),
    'trim': wrap('trim', typecheck({
        f: strings.String.trim,
        argc: (count) => count === 1,
        args: (args) => isString(args[0]),
    })),
    'triml': wrap('triml', typecheck({
        argc: (count) => count === 1,
        args: (args) => isString(args[0]),
    })),
    'trimr': wrap('trimr', typecheck({
        f: strings.String.trimr,
        argc: (count) => count === 1,
        args: (args) => isString(args[0]),
    })),


    /////////////// OPTIC
    'optic': wrap('optic', typecheck({
        f: optic.optic,
        argc: (count) => count >= 1,
        args: (args) => args.every(isOpticCoercable),
    })),

    'ix': wrap('ix', typecheck({
        f: optic.ix,
        argc: (count) => count === 1,
        args: (args) => isNumber(args[0]),
    })),

    'key': wrap('key', typecheck({
        f: optic.key,
        argc: (count) => count === 1,
        args: (args) => isMapKey(args[0]),
    })),

    'traversed': wrap('traversed', typecheck({
        f: optic.traversed,
        argc: (count) => count === 0,
    })),

    'get': wrap('get', typecheck({
        f: optic.get,
        argc: (count) => count === 2,
        args: (args) => isOptic(args[0]) && opticLE(OpticType.Lens, args[0].subkind),
    })),

    'try-get': wrap('try-get', typecheck({
        f: optic.tryGet,
        argc: (count) => count === 2,
        args: (args) => isOptic(args[0]) && opticLE(OpticType.Affine, args[0].subkind),
    })),

    'get-all': wrap('get-all', typecheck({
        f: optic.getAll,
        argc: (count) => count === 2,
        args: (args) => isOptic(args[0]) && opticLE(OpticType.Traversal, args[0].subkind),
    })),

    'set': wrap('set', typecheck({
        f: optic.set,
        argc: (count) => count === 3,
        args: (args) => isOptic(args[0]) && opticLE(OpticType.Setter, args[0].subkind),
    })),

    'over': wrap('over', typecheck({
        f: optic.over,
        argc: (count) => count === 3,
        args: (args) => isOptic(args[0]) && opticLE(OpticType.Setter, args[0].subkind),
    })),
}

export default fixedTable
