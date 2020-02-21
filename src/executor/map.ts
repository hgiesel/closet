import {
    Slang,
    SlangMap,
    SlangOptional,
    SlangExecutable,
    SlangMapKey,
} from '../types'

import {
    isString,
    isKeyword,
} from '../reflection'

import {
    mkOptional,
} from '../constructors'

import {
    arm,
} from './functions'

export const indexing = ([mapArg, idx]: [SlangMap, SlangMapKey]): SlangOptional => {
    const maybeResult = mapArg.table.get(isString(idx)
        ? idx.value
        : Symbol.for(idx.value))

    return mkOptional(maybeResult ?? null)
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
    const armed = arm('merge-withfunc', func)

    for (const map of args) {
        map.table.forEach((v, k) => {
            if (headMap.table.has(k)) {
                headMap.table.set(k, armed.apply([headMap.table.get(k), v], ctx))
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
