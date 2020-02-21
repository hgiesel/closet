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
