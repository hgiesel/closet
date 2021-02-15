import type { Delimiters } from '../delimiters'
import type { Lexer } from 'moo'

import { states } from 'moo'

export const keyPattern = /(?:[a-zA-Z_#/]|%\w)+\d*/u

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Escaping
const escapeRegExp = (str: string): string =>
    str.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&')

export const makeLexer = (delimiters: Delimiters): Lexer => {
    const outerTextPattern = new RegExp(`[\\s\\S]+?(?=${escapeRegExp(delimiters.open)}|$)`, 'u')
    const innerTextPattern = new RegExp(`[\\s\\S]+?(?=${escapeRegExp(delimiters.open)}|${escapeRegExp(delimiters.close)})`, 'u')

    // img tags are parsed via HTML (!)
    return states({
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
    }) as Lexer
}
