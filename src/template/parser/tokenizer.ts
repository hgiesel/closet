import * as moo from 'moo'

import {
    TAG_OPEN,
    TAG_CLOSE,
    ARG_SEP,
} from '../utils'

export const keyPattern = /(?:[a-zA-Z_/]|%\w)+\d*/u

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Escaping
const escapeRegExp = (str: string): string =>
    str.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&')

const outerTextPattern = new RegExp(`[\\s\\S]+?(?=${escapeRegExp(TAG_OPEN)}|$)`, 'u')
const innerTextPattern = new RegExp(`[\\s\\S]+?(?=${escapeRegExp(TAG_OPEN)}|${escapeRegExp(TAG_CLOSE)})`, 'u')

// img tags are parsed via HTML (!)
export const templateTokenizer = moo.states({
    main: {
        tagopen: {
            match: TAG_OPEN,
            push: 'key',
        },
        text: {
            match: outerTextPattern,
            lineBreaks: true,
        },
    },

    key: {
        keyname: {
            match: keyPattern,
        },
        sep: {
            match: ARG_SEP,
            next: 'intag',
        },
        tagclose: {
            match: TAG_CLOSE,
            pop: 1,
        },
    },

    intag: {
        tagopen: {
            match: TAG_OPEN,
            push: 'key',
        },
        tagclose: {
            match: TAG_CLOSE,
            pop: 1,
        },
        text: {
            match: innerTextPattern,
            lineBreaks: true,
        },
    },
})
