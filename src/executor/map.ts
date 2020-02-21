import {
    Slang,
    SlangMap,
    SlangVector,
    SlangOptional,
    SlangExecutable,
    SlangMapKey,
    SlangBool,
} from '../types'

import {
    isString,
    isKeyword,
} from '../reflection'

import {
    mkOptional,
    mkVector,
    mkKeyword,
    mkString,
    mkBool,
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


export const merge = ([headMap, ...args]: [SlangMap, ...SlangMap[]]): SlangMap => {
    for (const map of args) {
        map.table.forEach((v, k) => {
            headMap.table.set(k, v)
        })
    }

    return headMap
}

export const mergeWith = ([func, headMap, ...args]: [SlangExecutable, SlangMap, ...SlangMap[]], ctx: Map<string, Slang>) => {
    const armed = arm(func)

    for (const map of args) {
        map.table.forEach((v, k) => {
            if (headMap.table.has(k)) {
                headMap.table.set(k, apply(armed, [headMap.table.get(k), v], ctx))
            }

            else {
                headMap.table.set(k, v)
            }
        })
    }

    return headMap
}

const reshape = (arr: any[], columnSize: number): any[][] => {
    var newArr = [];

    while (arr.length > 0) {
        newArr.push(arr.splice(0, columnSize))
    }

    return newArr
}

export const assoc = (args: Slang[]) => {
    const theMap = args[0]

    for (const pair of reshape(args.slice(1), 2)) {
        if (isString(pair[0])) {
            //@ts-ignore
            theMap.table.set(pair[0].value, pair[1])
        }

        else if (isKeyword(pair[0])) {
            //@ts-ignore
            theMap.table.set(Symbol.for(pair[0].value), pair[1])
        }
    }

    return theMap
}

export const dissoc = (args: Slang[]) => {
    const theMap = args[0]

    for (const val of args.slice(1)) {
        if (isString(val)) {
            //@ts-ignore
            theMap.table.delete(val.value)
        }

        else if (isKeyword(val)) {
            //@ts-ignore
            theMap.table.delete(Symbol.for(val.value))
        }
    }

    return theMap
}
