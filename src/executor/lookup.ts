import {
    Slang,
    SlangSymbol,
} from '../types'

const globalTable = {}

export const globalDefine = ([key, val]: [SlangSymbol, Slang]): void => {
    globalTable[key.value] = val
}


export const globalLookup = (key: SlangSymbol): Slang => {
    return globalTable[key.value]
}

const localTable = {}

export const localDefine = (value) => {

}


export const localLookup = () => {
}
