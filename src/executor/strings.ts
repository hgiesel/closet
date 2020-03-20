import {
    SlangString,
    SlangVector,
    SlangBool,
} from '../types'

import {
    mkBool,
    mkString,
    mkVector,
} from '../constructors'

import * as equality from './equality'
import { pureToString } from './coerce'

export namespace String {
    export const startsWithQ = ([prefix, str]: [SlangString, SlangString]): SlangBool => { 
        return mkBool(str.value.startsWith(prefix.value))
    }

    export const endsWithQ = ([suffix, str]: [SlangString, SlangString]): SlangBool => { 
        return mkBool(str.value.endsWith(suffix.value))
    }

    export const includesQ = ([infix, str]: [SlangString, SlangString]): SlangBool => { 
        return mkBool(str.value.includes(infix.value))
    }

    export const reverse = ([str]: [SlangString]): SlangString => {
        return mkString(str.value.split('').reverse().join(''))
    }

    export const join = ([sep, list]: [SlangString, SlangVector]): SlangString => {
        return mkString(list.members.map(v => pureToString(v)).join(sep.value))
    }

    export const blankQ = ([str]: [SlangString]): SlangBool => {
        return mkBool(str.value.length === 0)
    }

    export const capitalize = ([str]: [SlangString]): SlangString => {
        return mkString(str.value.length === 0
            ? ''
            : str.value[0].toLocaleUpperCase + str.value.slice(1).toLocaleLowerCase())
    }

    export const lowerCase = ([str]: [SlangString]): SlangString => {
        return mkString(str.value.toLocaleLowerCase())
    }

    export const upperCase = ([str]: [SlangString]): SlangString => {
        return mkString(str.value.toLocaleUpperCase())
    }

    export const trim = ([str]: [SlangString]): SlangString => {
        return mkString(str.value.trim())
    }

    export const triml = ([str]: [SlangString]): SlangString => {
        return mkString(str.value.trimLeft())
    }

    export const trimr = ([str]: [SlangString]): SlangString => {
        return mkString(str.value.trimRight())
    }
}

export namespace Vector {
    export const startsWithQ = ([prefix, vec]: [SlangVector, SlangVector]): SlangBool => {
        let result = true

        if (prefix.members.length > vec.members.length) {
            result = false
        }

        for (const [idx, m] of prefix.members.entries()) {
            result = result && equality.twoValueCompare(vec.members[idx], m)
        }

        return mkBool(result)
    }

    export const endsWithQ = ([suffix, vec]: [SlangVector, SlangVector]): SlangBool => { 
        let result = true

        if (suffix.members.length > vec.members.length) {
            result = false
        }

        for (let i = 0; i < suffix.members.length; i++) {
            result = result && equality.twoValueCompare(
                vec.members[vec.members.length - (i + 1)],
                suffix.members[suffix.members.length - (i + 1)],
            )
        }

        return mkBool(result)
    }

    export const includesQ = ([infix, vec]: [SlangVector, SlangVector]): SlangBool => { 
        let result = false

        if (infix.members.length <= vec.members.length) {
            for (let idx = 0; !result && idx < vec.members.length; idx++) {
                // can still fit
                if (idx + infix.members.length <= vec.members.length) {

                    let fail = false
                    for (let uptoIndex = 0; !fail && uptoIndex !== infix.members.length; uptoIndex++) {
                        if (!equality.twoValueCompare(vec.members[idx + uptoIndex], infix.members[uptoIndex])) {
                            fail = true
                        }
                    }

                    result = !fail
                }
            }
        }

        return mkBool(result)
    }

    export const reverse = ([vec]: [SlangVector]): SlangVector => {
        return mkVector(vec.members.slice().reverse())
    }
}
