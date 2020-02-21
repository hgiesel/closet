import type {
    SlangNumber,
    SlangBool,
} from '../types'

import {
    mkNumber,
    mkBool,
} from '../constructors'

export const addition = (args: SlangNumber[]): SlangNumber => {
    let sum = 0

    for (const arg of args) {
        sum += arg.value
    }

    return mkNumber(sum)
}

export const subtraction = ([headArg, ...args]: SlangNumber[]): SlangNumber => {
    let diff = headArg.value

    for (const arg of args) {
        diff -= arg.value
    }

    return mkNumber(diff)
}

export const multiplication = (args: SlangNumber[]): SlangNumber => {
    let prod = 1

    for (const arg of args) {
        prod *= arg.value
    }

    return mkNumber(prod)
}

export const division = ([headArg, ...args]: SlangNumber[]): SlangNumber => {
    let quot = headArg.value

    for (const arg of args.slice(1)) {
        quot /= arg.value
    }

    return mkNumber(quot)
}

export const ge = ([headArg, ...args]: SlangNumber[]): SlangBool => {
    let result = true

    for (const arg of args) {
        result = result && (headArg.value >= arg.value)
        headArg = arg
    }

    return mkBool(result)
}

export const gt = ([headArg, ...args]: SlangNumber[]): SlangBool => {
    let result = true

    for (const arg of args) {
        result = result && (headArg.value > arg.value)
        headArg = arg
    }

    return mkBool(result)
}

export const le = ([headArg, ...args]: SlangNumber[]): SlangBool => {
    let result = true

    for (const arg of args) {
        result = result && (headArg.value <= arg.value)
        headArg = arg
    }

    return mkBool(result)
}

export const lt = ([headArg, ...args]: SlangNumber[]): SlangBool => {
    let result = true

    for (const arg of args) {
        result = result && (headArg.value < arg.value)
        headArg = arg
    }

    return mkBool(result)
}

export const evenQ = ([headArg]: [SlangNumber]): SlangBool => {
    return mkBool(headArg.value % 2 === 0)
}

export const oddQ = ([headArg]: [SlangNumber]): SlangBool => {
    return mkBool(headArg.value % 2 === 1)
}

export const posQ = ([headArg]: [SlangNumber]): SlangBool => {
    return mkBool(headArg.value >= 0)
}

export const negQ = ([headArg]: [SlangNumber]): SlangBool => {
    return mkBool(headArg.value < 0)
}

export const round = ([headArg]: [SlangNumber]): SlangNumber => {
    return mkNumber(Math.round(headArg.value))
}

export const floor = ([headArg]: [SlangNumber]): SlangNumber => {
    return mkNumber(Math.floor(headArg.value))
}

export const ceil = ([headArg]: [SlangNumber]): SlangNumber => {
    return mkNumber(Math.ceil(headArg.value))
}

export const min = ([...args]: SlangNumber[]): SlangNumber => {
    return mkNumber(args.length === 0
        ? Number.MAX_SAFE_INTEGER
        : Math.min(...args.map(a => a.value))
    )
}

export const max = ([...args]: SlangNumber[]): SlangNumber => {
    return mkNumber(args.length === 0
        ? Number.MIN_SAFE_INTEGER
        : Math.max(...args.map(a => a.value))
    )
}
