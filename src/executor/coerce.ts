import type {
    SlangTypes,
    SlangBool,
    SlangString,
    Slang,
} from '../types'

import {
    mkBool,
    mkString,
} from '../constructors'

import * as reflection from '../reflection'

export const toBool = (val: Slang): SlangBool => {
    if (reflection.isBool(val)) {
        return val
    }

    else if (reflection.isOptional(val) && val.boxed === null) {
        return mkBool(false)
    }

    return mkBool(true)
}

const pureToString = (val: Slang): string => {
    if (reflection.isBool(val)) {
        return val.value
            ? '#true'
            : '#false'
    }

    else if (reflection.isString(val)) {
        return `"${val.value}"`
    }

    else if (reflection.isNumber(val)) {
        return String(val.value)
    }

    else if (reflection.isSymbol(val)) {
        return val.value
    }

    else if (reflection.isKeyword(val)) {
        return `:${val.value}`
    }

    else if (reflection.isQuoted(val)) {
        return `'${pureToString(val.quoted)}`
    }

    else if (reflection.isOptional(val)) {
        return `&${pureToString(val.boxed)}`
    }

    else if (reflection.isVector(val)) {
        return `[${val.members.map(pureToString).join(' ')}]`
    }

    else if (reflection.isMap(val)) {
        const mapStrings = []
        val.table.forEach((v, k) => {
            mapStrings.push(typeof k === 'symbol'
                ? `:${k.description}`
                : k)
            mapStrings.push(pureToString(v))
        })

        return `{${mapStrings.join(' ')}}`
    }
}

export const toString = (val: Slang): SlangString => {
    return mkString(pureToString(val))
}