import {
    Slang,
} from '../types'

export const identity = ([val]: [Slang]): Slang => {
    return val
}

export const constant = ([val, _throwaway]: [Slang, Slang]): Slang => {
    return val
}
