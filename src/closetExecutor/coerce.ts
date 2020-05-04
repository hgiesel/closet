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

export const pureToBool = (val: Slang): boolean => {
    if (reflection.isBool(val)) {
        return val.value
    }

    return true
}

export const toBool = (val: Slang): SlangBool => {
    return mkBool(pureToBool(val))
}

export const pureToString = (val: Slang): string => {
    if (reflection.isUnit(val)) {
        return '()'
    }

    else if (reflection.isBool(val)) {
        return val.value
            ? '#true'
            : '#false'
    }

    else if (reflection.isString(val)) {
        return `"${val.value}"`
    }

    else if (reflection.isRegex(val)) {
        return `#"${val.value.toString().slice(1, -1)}"`
    }

    else if (reflection.isNumber(val)) {
        return Number.isNaN(val.value)
            ? '#nan'
            : val.value === Infinity
            ? '#inf'
            : val.value === -Infinity
            ? '#-inf'
            : String(val.value)
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

    else if (reflection.isAtom(val)) {
        return `(atom ${pureToString(val.atom)})`
    }

    else if (reflection.isOptional(val)) {
        if (val.boxed) {
            return `&${pureToString(val.boxed)}`
        }

        return `#none`
    }

    else if (reflection.isVector(val)) {
        return `[${val.members.map(pureToString).join(' ')}]`
    }

    else if (reflection.isList(val)) {
        return `(${pureToString(val.head)}${val.tail.map(v => ` ${pureToString(v)}`).join('')})`
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

    else if (reflection.isFunction(val)) {
        return `fn<${val.name}>(${val.params.map(pureToString).join(',')}) ${pureToString(val.body)}`
    }
    else if (reflection.isShcutFunction(val)) {
        return `fn<${val.name}>(${val.params}) ${pureToString(val.body)}`
    }
    else if (reflection.isArmedFunction(val)) {
        return `fn<${val.name}>`
    }

    else if (reflection.isOptic(val)) {
        return `optic<${val.subkind}:${val.name}>`
    }
}

export const toString = (val: Slang): SlangString => {
    return mkString(pureToString(val))
}
