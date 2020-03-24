import {
    SlangOptic,
    OpticType,
} from '../types'

import {
    mkVector,
    mkOptional,
} from '../constructors'

import {
    isVector,
} from '../reflection'

export const opticSupremum = (type1: OpticType, type2: OpticType): OpticType | null => {
    switch (type1) {
        case OpticType.Setter:
            switch (type2) {
                case OpticType.Fold:
                case OpticType.Getter:
                    return null
                default:
                    return type1
            }

        case OpticType.Fold:
            switch (type2) {
                case OpticType.Setter:
                    return null
                default:
                    return type1
            }

        case OpticType.Traversal:
            switch (type2) {
                case OpticType.Setter:
                case OpticType.Fold:
                    return type2
                case OpticType.Getter:
                    return OpticType.Setter
                default:
                    return type1
            }

        case OpticType.Affine:
            switch (type2) {
                case OpticType.Setter:
                case OpticType.Fold:
                case OpticType.Traversal:
                    return type2
                case OpticType.Getter:
                    return OpticType.Setter
                default:
                    return type1
            }

        case OpticType.Getter:
            switch (type2) {
                case OpticType.Setter:
                    return null
                case OpticType.Fold:
                case OpticType.Traversal:
                case OpticType.Affine:
                case OpticType.Prism:
                    return OpticType.Fold
                default:
                    return type1
            }

        case OpticType.Lens:
            switch (type2) {
                case OpticType.Fold:
                case OpticType.Traversal:
                case OpticType.Affine:
                case OpticType.Setter:
                    return type2
                case OpticType.Prism:
                    return OpticType.Affine
                default:
                    return type1
            }

        case OpticType.Prism:
            switch (type2) {
                case OpticType.Fold:
                case OpticType.Traversal:
                case OpticType.Affine:
                case OpticType.Setter:
                    return type2
                case OpticType.Lens:
                    return OpticType.Affine
                default:
                    return type1
            }

        case OpticType.Iso:
            return type2
    }
}

export const opticLE = (type1: OpticType, type2: OpticType): boolean =>
    opticSupremum(type1, type2) === type1

const dimap = (
    l: (x: unknown) => unknown,
    r: (x: unknown) => unknown,
    f: (x: unknown) => unknown,
) => (x: unknown) => r(f(l(x)))

const lmap = (l: (x: unknown) => unknown, f: (x: unknown) => unknown) => (x: unknown) => f(l(x))
// const rmap = (r: (x: unknown) => unknown, f: (y: unknown) => unknown) => (x: unknown) => r(f(x))

const forgetDimap = (l: (x: unknown) => unknown, _r: (x: unknown) => unknown, f: (x: unknown) => unknown) => lmap(l, f)

const wander = (self) => (xs) => {
    // console.log('foof', self, xs)
    // console.log('foof2', mkVector(xs.members.map(self)))

    return isVector(xs)
        ? mkVector(xs.members.map(self))
        : xs.boxed
        ? mkOptional(self(xs.boxed))
        : xs
}

export const dictSetter = {
    dimap: dimap,
    first: (self) => (p) => [self(p[0]), p[1]],
    right: (self) => (x) => (console.log('eju', self, x), [x[0].boxed ? self(x[0].boxed) : x[0], x[1]]),
    wander: wander,
}

export const dictGetter = {
    dimap: forgetDimap,
    first: (self) => (x) => self(x[0]),
    wander: wander,
}

export const dictAffine = {
    dimap: forgetDimap,
    first: (self) => (x) => self(x[0]),
    //  basically fmap @Maybe
    right: (self) => (x) => x[0].boxed ? self(x[0].boxed) : x[0],
    wander: wander,
}

export const dictTraversal = dictAffine

export const dictPrism = {
    dimap: (f, g, x) => g(x),
    right: (x) => [true, x],
}

export const run = (zooms: Function[], dict: object, f: Function) => {
    console.log(zooms)
    debugger
    for (const z of zooms.reverse()) {
        f = z(dict, f);
    }

    return f
}
