import {
    Slang,
    SlangBool,
    SlangType,
} from '../types'

import {
    mkBool,
} from '../constructors'

export const twoValueCompare = (val1: Slang, val2: Slang): boolean => {
    if (val1.kind !== val2.kind) {
        return false
    }

    else if (val1.kind == SlangType.Unit) {
        return true
    }

    else if (
        val1.kind === SlangType.Bool    ||
        val1.kind === SlangType.Number  ||
        val1.kind === SlangType.Symbol  ||
        val1.kind === SlangType.Keyword ||
        val1.kind === SlangType.String
    ) {
        //@ts-ignore
        return val1.value === val2.value
    }

    else if (val1.kind === SlangType.List) {
        //@ts-ignore
        if (val1.tail.length !== val2.tail.length) {
            return false
        }

        //@ts-ignore
        let check = twoValueCompare(val1.head, val2.head)

        for (let i = 0; i < val1.tail.length; i++) {
            if (!check) {
                return false
            }

            //@ts-ignore
            check = twoValueCompare(val1.tail[i], val2.tail[i])
        }

        return check
    }

    else if (val1.kind === SlangType.Vector) {
        //@ts-ignore
        if (val1.members.length !== val2.members.length) {
            return false
        }

        //@ts-ignore
        let check = true

        for (let i = 0; i < val1.members.length; i++) {
            if (!check) {
                return false
            }

            //@ts-ignore
            check = twoValueCompare(val1.members[i], val2.members[i])
        }

        return check
    }

    else if (val1.kind === SlangType.Map) {
        //@ts-ignore
        if (val1.table.size !== val2.table.size) {
            return false
        }

        let result = true

        val1.table.forEach((value, key) => {
            //@ts-ignore
            if (!val2.table.has(key)) {
                result = false
            }

            //@ts-ignore
            result = result && twoValueCompare(val2.table.get(key), value)
        })

        return result
    }

    else if (val1.kind === SlangType.Quoted) {
        //@ts-ignore
        return twoValueCompare(val1.quoted, val2.quoted)
    }

    else if (val1.kind === SlangType.Optional) {
        if (val1.boxed === null) {
            //@ts-ignore
            if (val2.boxed === null) {
                return true
            }

            return false
        }

        //@ts-ignore
        return twoValueCompare(val1.boxed, val2.boxed)
    }

    else /* val1.kind === SlangType.Function */ {
        return false
    }
}

export const equality = (vals: Slang[]): SlangBool => {
    const headValue = vals.shift()

    let result = true

    for (const val of vals) {
        result = result && twoValueCompare(headValue, val)
    }

    return mkBool(result)
}

export const unequality = (vals: Slang[]): SlangBool => {
    const headValue = vals.shift()

    let result = false

    for (const val of vals) {
        result = result || twoValueCompare(headValue, val)
    }

    return mkBool(result)
}
