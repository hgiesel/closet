import {
    Slang,
    SlangMap,
    SlangVector,
    SlangOptional,
    SlangArmedFunction,
    SlangMapKey,
    SlangBool,
} from '../types'

import {
    isString,
} from '../reflection'

import {
    reshape
} from './utils'

import {
    mkOptional,
    mkVector,
    mkKeyword,
    mkString,
    mkBool,
    mkMapDirect,
    toMapKey,
} from '../constructors'

import {
    arm,
    apply,
} from './functions'

export const indexing = ([mapArg, idx]: [SlangMap, SlangMapKey]): SlangOptional => {
    const key = isString(idx)
        ? idx.value
        : Symbol.for(idx.value)

    const maybeResult = mapArg.table.get(key)

    return mkOptional(maybeResult ?? null)
}

export const containsQ = ([mapArg, idx]: [SlangMap, SlangMapKey]): SlangBool => {
    const key = isString(idx)
        ? idx.value
        : Symbol.for(idx.value)

    const result = mkBool(mapArg.table.has(key))
    return result
}

export const find = ([mapArg, idx]: [SlangMap, SlangMapKey]): SlangOptional => {
    const key = isString(idx)
        ? idx.value
        : Symbol.for(idx.value)

    return mapArg.table.has(key)
        ? mkOptional(mkVector([idx, mapArg.table.get(key)]))
        : mkOptional(null)
}


export const keys = ([mapArg]: [SlangMap]): SlangVector => {
    const keys = []

    mapArg.table.forEach((_v, k) => {
        if (typeof k === 'symbol') {
            //@ts-ignore
            keys.push(mkKeyword(k.description))
        }
        else if (typeof k === 'string') {
            keys.push(mkString(k))
        }
    })

    return mkVector(keys)
}

export const vals = ([mapArg]: [SlangMap]): SlangVector => {
    const keys = []

    mapArg.table.forEach((v, _k) => {
        keys.push(v)
    })

    return mkVector(keys)
}


export const merge = ([...maps]: [SlangMap, ...SlangMap[]]): SlangMap => {
    const newMap = new Map()

    for (const map of maps) {
        for (const [key, value] of map.table) {
            newMap.set(key, value)
        }
    }

    return mkMapDirect(newMap)
}

export const mergeWith = ([func, headMap, ...args]: [SlangArmedFunction, SlangMap, ...SlangMap[]], ctx: Map<string, Slang>) => {
    const newMap = new Map()

    for (const [key, value] of headMap.table) {
        newMap.set(key, value)
    }

    for (const map of args) {
        for (const [key, value] of map.table) {
            if (newMap.has(key)) {
                newMap.set(key, apply(func, [newMap.get(key), value], ctx))
            }
            else {
                newMap.set(key, value)
            }
        }
    }

    return mkMapDirect(newMap)
}

export const assoc = ([headMap, ...args]: [SlangMap, ...Slang[]]): SlangMap => {
    const newMap = new Map()

    for (const [key, value] of headMap.table) {
        newMap.set(key, value)
    }

    for (const [key, value] of reshape(args, 2)) {
        newMap.set(toMapKey(key), value)
    }

    return mkMapDirect(newMap)
}

export const dissoc = ([headMap, ...args]: [SlangMap, ...SlangMapKey[]]): SlangMap => {
    const newMap = new Map()
    const badKeys = args.map(a => toMapKey(a))

    for (const [key, value] of headMap.table) {
        if (!badKeys.some(bk => bk === key)) {
            newMap.set(key, value)
        }
    }

    return mkMapDirect(newMap)
}

export const hashMap = ([...args]: [...Slang[]]): SlangMap => {
    const newMap = new Map()

    for (const [key, value] of reshape(args, 2)) {
        newMap.set(toMapKey(key), value)
    }

    return mkMapDirect(newMap)
}
