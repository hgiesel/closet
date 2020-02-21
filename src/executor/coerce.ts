import {
    SlangTypes,
    SlangBool,
    Slang,
} from '../types'

import {
    mkBool,
} from '../constructors'


export const toBool = (val: Slang): SlangBool => {
    if (val.kind === SlangTypes.Bool) {
        return val
    }

    else if (val.kind === SlangTypes.Optional && val.boxed === null) {
        return mkBool(false)
    }

    return mkBool(true)
}
