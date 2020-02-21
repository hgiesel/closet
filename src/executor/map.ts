import {
    Slang,
    SlangMap,
    SlangExecutable,
} from '../types'

import {
    isString,
    isKeyword,
    isMap,
} from '../reflection'

import {
    mkOptional,
    mkMap,
} from '../constructors'

import {
    SlangArityError,
    SlangTypeError,
} from './exception'

import {
    arm,
} from './functions'

export const indexing = (mapArg: SlangMap, args: Slang[]) => {
    if (args.length !== 1) {
        throw new SlangArityError('f', args.length)
    }

    if (isString(args[0])) {
        const maybeResult = mapArg.table.get(args[0].value)

        return mkOptional(maybeResult ? maybeResult : null)
    } else if (isKeyword(args[0])) {
        const maybeResult = mapArg.table.get(Symbol.for(args[0].value))

        return mkOptional(maybeResult ? maybeResult : null)
    }

    throw new SlangTypeError('Value needs to be a string or number', 'f', 4)
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
    if (args.length % 2 !== 1) {
        throw new SlangArityError('f', args.length)
    }
    else if (!isMap(args[0])) {
        throw new SlangTypeError('f', 'f',  args.length)
    }

    const theMap = args[0]

    for (const pair of reshape(args.slice(1), 2)) {
        if (isString(pair[0])) {
            theMap.table.set(pair[0].value, pair[1])
        }

        else if (isKeyword(pair[0])) {
            theMap.table.set(Symbol.for(pair[0].value), pair[1])
        }

        else {
            throw new SlangTypeError('Map key needs to be a string or keyword', 'f', 4)
        }
    }

    return theMap
}

export const dissoc = (args: Slang[]) => {
    if (args.length === 0) {
        throw new SlangArityError('f', args.length)
    }
    else if (!isMap(args[0])) {
        throw new SlangTypeError('f', 'f', args.length)
    }

    const theMap = args[0]

    for (const val of args.slice(1)) {
        if (isString(val)) {
            theMap.table.delete(val.value)
        }

        else if (isKeyword(val)) {
            theMap.table.delete(Symbol.for(val.value))
        }

        else {
            throw new SlangTypeError('Map key needs to be a string or keyword', 'f', 4)
        }
    }

    return theMap
}
