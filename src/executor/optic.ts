import {
    Slang,
    SlangNumber,
    OpticType,
    SlangOptic,
    SlangString,
    SlangKeyword,
    SlangVector,
    SlangMap,
    SlangOptional,
    SlangArmedFunction,
} from '../types'

import {
    mkOptic,
    mkVector,
    mkMapDirect,
    toMapKey,
    mkOptional,
} from '../constructors'

import {
    isNumber,
    isOptic,
    isMapKey,
    isVector,
    isMap,
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

    dictGetter,
    dictSetter,
    dictTraversal,
    dictPrism,
    dictAffine,

    run,
} from './optic-helper'

export const optic = ([headOptic, ...optics]: Slang[]): SlangOptic => {
    return optics.map(coerceOptic).reduce(mergeOptic, coerceOptic(headOptic))
}

export const mergeOptic = (op1: SlangOptic, op2: SlangOptic): SlangOptic => {
    const newName = op1.name + '.' + op2.name
    const newSubkind = opticSupremum(op1.subkind, op2.subkind)
    // @ts-ignore
    return mkOptic(newSubkind, newName, [op1.zooms, op2.zooms].flat())
}

export const coerceOptic = (val: Slang): SlangOptic => {
    if (isOptic(val)) {
        return val
    }

    else if (isNumber(val)) {
        return ix([val])
    }

    else if (isMapKey(val)) {
        return key([val])
    }

    else {
        throw 'cannot be coerced'
    }
}

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

    return mkOptic(OpticType.Affine, 'ix', [(dict, f0) => {
        const f1 = dict.right(f0)
        const f2 = dict.dimap(getter, setter, f1)
        return f2
    }])
}

export const key = ([k]: [SlangKeyword | SlangString]) => {
    const theKey = toMapKey(k)

    const getter = (s: SlangMap) => {
        if (!isMap(s)) {
            throw 'needs to be map'
        }

        const holeTable = new Map(s.table)
        holeTable.delete(theKey)

        const result = s.table.get(theKey) ?? null

        return [mkOptional(result), mkMapDirect(holeTable)]
    }

    const setter = ([val, orig]: [SlangOptional, SlangMap]) => {
        const copy: Map<string | symbol, Slang> = new Map(orig.table)

        if (val.boxed) {
            copy.set(theKey, val.boxed)
        }

        return mkMapDirect(copy)
    }

    return mkOptic(OpticType.Lens, 'key', [(dict, f0) => {
        const f1 = dict.first(f0)
        const f2 = dict.dimap(getter, setter, f1)
        return f2
    }])
}

const traversedCached = mkOptic(OpticType.Traversal, 'traversed', [(dict, f0) => {
    return dict.wander(f0)
}])

export const traversed = ([]) => traversedCached

export const filtered = (pred) => {
  // s -> Either t a
  const filteredGetter = (x) => {
    return [pred(x), x]
  }

  return mkOptic(OpticType.Lens, 'filtered', [(dict, f0: Function) => {
      const f1 = dict.right(f0)
      const f2 = dict.dimap(filteredGetter, (x) => x[1], f1)
      return f2;
  }])
}


//////////// CONSUMING OPTICS

export const get = ([lens, value]: [SlangOptic, Slang]): Slang => {
    const f = run(lens.zooms, dictGetter, (x: Slang) => identity([x]))
    const result = f(value)
    return result
}

export const tryGet = ([affine, value]: [SlangOptic, Slang]): SlangOptional => {
    const f = run(affine.zooms, dictAffine, (x: Slang | null) => mkOptional(x))
    const result = f(value)
    return result
}

export const getAll = ([traversal, value]: [SlangOptic, Slang]): SlangOptional => {
    const f = run(traversal.zooms, dictTraversal, (x: Slang) => identity([x]))
    const result = f(value)
    return result
}

export const set = ([setter, d, value]: [SlangOptic, Slang, Slang]): Slang => {
    const f = run(setter.zooms, dictSetter, (x: Slang) => constant2([d, x]))
    return f(value)
}

export const over = ([setter, g, value]: [SlangOptic, SlangArmedFunction, Slang], ctx: Map<string, Slang>): Slang => {
    const f = run(setter.zooms, dictSetter, (x: Slang) => apply(g, [x], ctx))
    return f(value)
}
