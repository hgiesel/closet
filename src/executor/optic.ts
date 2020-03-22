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
    isVector,
} from '../reflection'

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

    dictGetter,
    dictSetter,
    dictPrism,
    dictAffine,

    run,
} from './optic-helper'

export const ix = ([i]: [SlangNumber]): SlangOptic => {
    const getter = (s: SlangVector) => {
        if (!isVector(s)) {
            throw 'needs to be vector'
        }

        const result = s.members[i.value] ?? null
        return [mkOptional(result), s]
    }

    const setter = ([val, orig]) => {
        let result = orig

        if (orig.members[i.value]) {
            const copy = mkVector([...orig.members])
            copy.members[i.value] = val

            result =  copy
        }

        return result
    }

    return mkOptic(OpticType.Affine, 'ix', (dict, f0) => {
        const f1 = dict.right(f0)
        const f2 = dict.dimap(getter, setter, f1)
        return f2
    })
}

export const key = ([k]: [SlangKeyword | SlangString]) => {
    const getter = (s) => [s.get(k), s]
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


//////////// CONSUMING OPTICS

export const get = ([lens, value]: [SlangVector, Slang]): Slang => {
    const f = run(lens.members as SlangOptic[], dictGetter, (x: Slang) => identity([x]))
    const result = f(value)
    return result
}

export const tryGet = ([affine, value]: [SlangVector, Slang]): SlangOptional => {
    const f = run(affine.members as SlangOptic[], dictAffine, (x: Slang | null) => mkOptional(x))
    const result = f(value)
    return result
}

export const set = ([setter, d, value]: [SlangVector, Slang, Slang]): Slang => {
    const f = run(setter.members as SlangOptic[], dictSetter, (x: Slang) => constant2([d, x]))
    return f(value)
}

export const over = ([setter, g, value]: [SlangVector, SlangArmedFunction, Slang], ctx: Map<string, Slang>): Slang => {
    const f = run(setter.members as SlangOptic[], dictSetter, (x: Slang) => apply(g, [x], ctx))
    debugger
    return f(value)
}
