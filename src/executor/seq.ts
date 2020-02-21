import type {
    Slang,
    SlangSeq,
    SlangNumber,
    SlangMapKey,
} from '../types'

import {
    isMap,
    isVector,
    isList,
    isOptional,
    isString,
} from '../reflection'

export const getFunc = ([seqArg, idx, defaultValue]: [SlangSeq, SlangMapKey | SlangNumber, Slang]): Slang => {
    if (isMap(seqArg)) {
        const key = isString(idx)
            ? idx.value
            //@ts-ignore
            : Symbol.for(idx.value)

        const result = seqArg.table.has(key)
            ? seqArg.table.get(key)
            : defaultValue

        return result
    }

    else if (isVector(seqArg)) {
        const result = seqArg.members[idx.value] ?? defaultValue
        return result
    }

    else if (isList(seqArg)) {
        return idx.value === 0
            ? seqArg.head
            //@ts-ignore
            : (seqArg.tail[idx.value - 1] ?? defaultValue)
    }

    else if (isOptional(seqArg)) {
        console.log('f', seqArg)
        return idx.value === 0
            ? seqArg.boxed ?? defaultValue
            : defaultValue
    }
}
