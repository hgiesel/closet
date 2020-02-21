import {
    Slang,
    SlangMap,
} from '../types'

import {
    isString,
    isKeyword,
    mkOptional,
} from '../constructors'

import {
    SlangArityError,
    SlangTypeError,
} from './exception'

export const indexing = (mapArg: SlangMap, args: Slang[]) => {
    if (args.length !== 1) {
        throw new SlangArityError(args.length)
    }

    if (isString(args[0])) {
        const maybeResult = mapArg.table.get(args[0].value)

        return mkOptional(maybeResult ? maybeResult : null)
    } else if (isKeyword(args[0])) {
        const maybeResult = mapArg.table.get(Symbol.for(args[0].value))

        return mkOptional(maybeResult ? maybeResult : null)
    }

    throw new SlangTypeError('Value needs to be a string or number')
}
