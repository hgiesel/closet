import {
    Slang,
    SlangMap,
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

export const indexing = (mapArg: SlangMap, args: Slang[]) => {
    if (args.length !== 1) {
        throw new SlangArityError(args.length)
    }

    if (isString(args[0])) {
        const maybeResult = mapArg.table.get(args[0].value)

        return mkOptional(maybeResult ? maybeResult : null)
    } else if (isKeyword(args[0])) {
        const maybeResult = mapArg.table.get(Symbol.for(args[0].value))

        return mkOptional(maybeResult ? maybeResult : null)
    }

    throw new SlangTypeError('Value needs to be a string or number')
}

export const merge = (args: Slang[]) => {
    const newMap: SlangMap = mkMap([])

    for (const arg of args) {
        if (!isMap(arg)) {
            throw new SlangTypeError('Value needs to be a map')
        }

        arg.table.forEach((v, k) => {
            newMap.table.set(k, v)
        })
    }

    return newMap
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
        throw new SlangArityError(args.length)
    }
    else if (!isMap(args[0])) {
        throw new SlangTypeError(args.length)
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
            throw new SlangTypeError('Map key needs to be a string or keyword')
        }
    }

    return theMap
}

export const dissoc = (args: Slang[]) => {
    if (args.length === 0) {
        throw new SlangArityError(args.length)
    }
    else if (!isMap(args[0])) {
        throw new SlangTypeError(args.length)
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
            throw new SlangTypeError('Map key needs to be a string or keyword')
        }
    }

    return theMap
}
