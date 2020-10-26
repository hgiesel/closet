import type { Delimiters } from '../utils'

import * as moo from 'moo'


export const keyPattern = /(?:[a-zA-Z_/]|%\w)+\d*/u

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Escaping
const escapeRegExp = (str: string): string =>
    str.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&')

export const tokenizer = (delimiters: Delimiters): any => {
    const outerTextPattern = new RegExp(`[\\s\\S]+?(?=${escapeRegExp(delimiters.open)}|$)`, 'u')
    const innerTextPattern = new RegExp(`[\\s\\S]+?(?=${escapeRegExp(delimiters.open)}|${escapeRegExp(delimiters.close)})`, 'u')

    // img tags are parsed via HTML (!)
    const lexer = moo.states({
        main: {
            tagopen: {
                match: delimiters.open,
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
                match: delimiters.sep,
                next: 'intag',
            },
            tagclose: {
                match: delimiters.close,
                pop: 1,
            },
        },

        intag: {
            tagopen: {
                match: delimiters.open,
                push: 'key',
            },
            tagclose: {
                match: delimiters.close,
                pop: 1,
            },
            text: {
                match: innerTextPattern,
                lineBreaks: true,
            },
        },
    })

    return Object.assign(lexer, delimiters)
}
