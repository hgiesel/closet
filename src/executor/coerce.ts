import type {
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
        if (val.boxed) {
            return `&${pureToString(val.boxed)}`
        }

        return `#nil`
    }

    else if (reflection.isVector(val)) {
        return `[${val.members.map(pureToString).join(' ')}]`
    }

    else if (reflection.isMap(val)) {
        const mapStrings = []
        val.table.forEach((v, k) => {
            mapStrings.push([
                typeof k === 'symbol'
                    //@ts-ignore
                    ? `:${k.description}`
                    : `"${k}"`,
                pureToString(v),
            ])
        })

        return `{${mapStrings.map(v => v.join(' ')).join(', ')}}`
    }
}

export const toString = (val: Slang): SlangString => {
    return mkString(pureToString(val))
}
