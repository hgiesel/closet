import {
    Slang,
    SlangVector,
} from '../types'

import {
    isNumber,
    mkOptional,
} from '../constructors'

import {
    SlangArityError,
    SlangTypeError,
} from './exception'

export const indexing = (listArg: SlangVector, args: Slang[]) => {
    if (args.length !== 1) {
        throw new SlangArityError(args.length)
    } else if (!isNumber(args[0])) {
        throw new SlangTypeError('Value needs to be a number')
    }

    const maybeResult = listArg.members[args[0].real]

    return mkOptional(maybeResult ? maybeResult : null)
}
