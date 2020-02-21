import type {
    Slang,
    SlangVector,
    SlangOptional,
} from '../types'

import {
    mkOptional,
} from '../constructors'

import {
    isNumber,
} from '../reflection'

import {
    SlangArityError,
    SlangTypeError,
} from './exception'

export const indexing = (listArg: SlangVector, args: Slang[]): SlangOptional => {
    if (args.length !== 1) {
        throw new SlangArityError('f', args.length)
    }

    else if (!isNumber(args[0])) {
        throw new SlangTypeError('Value needs to be a number', 'f', 3)
    }

    const maybeResult = listArg.members[args[0].value]

    return mkOptional(maybeResult ?? null)
}
