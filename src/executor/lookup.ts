import {
    Slang,
    SlangSymbol,
    SlangUnit,
} from '../types'

import {
    mkUnit,
    isSymbol,
} from '../constructors'

import {
    SlangArityError,
    SlangTypeError,
} from './exception'

const globalTable = new Map()

export const globalDefine = (key: string, value: Slang): SlangUnit => {
    globalTable.set(key, value)

    return mkUnit()
}


export const globalLookup = (key: SlangSymbol): Slang => {
    return globalTable.has(key.value)
        ? globalTable.get(key.value)
        : key
}

const localTable = {}

export const localDefine = (value) => {
}

export const localLookup = () => {
}
