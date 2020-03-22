import {
    Slang,
    SlangNumber,
    OpticType,
    SlangOptic,
    SlangString,
    SlangKeyword,
    SlangVector,
    SlangOptional,
    SlangArmedFunction,
} from '../types'

import {
    mkOptic,
    mkVector,
    toMapKey,
    mkOptional,
} from '../constructors'

import {
    Optional,
} from './seq'

import {
    identity,
    constant2,
} from './combinators'

import {
    apply,
} from './functions'

import {
    opticSupremum,
    opticLE,
} from './optic-helper'

const dimap = (
    l: (x: unknown) => unknown,
    r: (x: unknown) => unknown,
    f: (x: unknown) => unknown,
) => (x: unknown) => r(f(l(x)))

const lmap = (l: (x: unknown) => unknown, f: (x: unknown) => unknown) => (x: unknown) => f(l(x))
// const rmap = (r: (x: unknown) => unknown, f: (y: unknown) => unknown) => (x: unknown) => r(f(x))

const forgetDimap = (l: (x: unknown) => unknown, _r: (x: unknown) => unknown, f: (x: unknown) => unknown) => lmap(l, f)

var dictFunc = {
    dimap: dimap,
    // u.assert(arguments.length === 3, "dimap: there should be 3 arguments");
    // u.assert(u.isFunction(f), "dimap: f should be a function");
    // u.assert(u.isFunction(g), "dimap: g should be a function");
    first: (self) => (p) => [self(p[0]), p[1]],
    // u.assert(arguments.length === 1, "first: there should be 1 argument");
    right: (self) => (x) => [x[0], x[0] ? self(x[1]) : x[1]],
    // u.assert(arguments.length === 1, "right: there should be 1 argument");
    wander: (self) => (xs) => xs.map(self),
    // u.assert(arguments.length === 1, "wander: there should be 1 argument");
}

const dictForgetNone = {
    dimap: forgetDimap,
    first: (self) => (x) => (console.log('fofo', x,self), self(x[0])),
    // u.assert(arguments.length === 1, "first: there should be 1 argument");
    wander: (self) => (xs) => xs.map(self),
    // u.assert(arguments.length === 1, "wander: there should be 1 argument");
}

const indexGetter = (i) => (s) => [s[i], s]

export const ix = ([i]: [SlangNumber]): SlangOptic => {
    const getter = (s: SlangVector) => (console.log(s, i, 'meh'), [mkOptional(s.members[i.value] ?? null), s])
    const setter = ([val, orig]) => {
        const copy = mkVector([...orig.members])
        copy.members[i.value] = val
        return copy
    }

    return mkOptic(OpticType.Affine, 'ix', (dict, f0) => {
        const f1 = dict.first(f0)
        const f2 = dict.dimap(getter, setter, f1)
        return f2
    })
}

export const key = ([k]: [SlangKeyword | SlangString]) => {
    const getter = indexGetter(k)
    const setter = ([val, orig]) => {
        const copy = Object.assign({}, orig)
        copy.set(toMapKey(k), val)
        return copy
    }

    return mkOptic(OpticType.Lens, 'key', (dict, f0) => {
        const f1 = dict.first(f0)
        const f2 = dict.dimap(getter, setter, f1)
        return f2
    })
}

const traversed = () => ({
    subkind: "traversal",
    zoom: (dict, x) => dict.wander(x)
})

export const get = ([lens, value]: [SlangVector, Slang]): Slang => {
    const f = run(lens.members as SlangOptic[], dictForgetNone, (x: Slang) => identity([x]))
    const result = f(value)
    console.log('hey there', lens, value, f, result)
    return result
}

export const tryGet = ([affine, value]: [SlangVector, Slang]): SlangOptional => {
    const f = run(affine.members as SlangOptic[], dictForgetNone, (x: Slang) => identity([x]))
    const result = f(mkOptional(value))
    return result
}

export const set = ([setter, d, value]: [SlangVector, Slang, Slang]): Slang => {
    const f = run(setter.members as SlangOptic[], dictFunc, (x: Slang) => constant2([d, x]))
    return f(value)
}

export const over = ([setter, g, value]: [SlangVector, SlangArmedFunction, Slang], ctx: Map<string, Slang>): Slang => {
    const f = run(setter.members as SlangOptic[], dictFunc, (x: Slang) => apply(g, [x], ctx))
    return f(value)
}

const run = (optics: SlangOptic[], dict: object, f: Function) => {
    const [
        zooms,
        opticKind,
    ] = optics.reduce(([rev, k], optic) =>
        (rev.unshift(optic.zoom), [rev, opticSupremum(k, optic.subkind)]),
        [[], OpticType.Iso]
    )

    for (const z of zooms) {
        f = z(dict, f);
    }

    return f
}

// const path = [traversed(), key('c')]
// const old = [{a: 1, b: 2}, {b: 3, c: 4}]
// const newv = over(path, old, (x) => (x + 1))
