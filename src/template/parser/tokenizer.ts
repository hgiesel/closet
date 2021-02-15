import type { Delimiters } from '../delimiters'
import type { Lexer } from 'moo'

import { states } from 'moo'

export const keyPattern = /(?:[a-zA-Z_]|%\w)+\d*/u

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Escaping
const escapeRegExp = (str: string): string =>
    str.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&')

export const makeLexer = (delimiters: Delimiters): Lexer => {
    const outerTextPattern = new RegExp(`[\\s\\S]+?(?=${escapeRegExp(delimiters.open)}|$)`, 'u')
    const innerTextPattern = new RegExp(`[\\s\\S]+?(?=${escapeRegExp(delimiters.open)}|${escapeRegExp(delimiters.close)})`, 'u')

    const inlineopen = {
        match: delimiters.open,
        push: 'inlinekey',
    }

    const blockopen = {
        match: `${delimiters.open}#`,
        push: 'blockkey',
    }

    const blockclose = {
        match: `${delimiters.open}/`,
        push: 'blockclose',
    }

    const closepop = {
        match: delimiters.close,
        pop: 1,
    }

    const closenext = (state: string) => ({
        match: delimiters.close,
        next: state,
    })

    const keyname = {
        match: keyPattern,
    }

    const outerText = {
        match: outerTextPattern,
        lineBreaks: true,
    }

    const text = {
        match: innerTextPattern,
        lineBreaks: true,
    }

    const sep = (state: string) => ({
        match: delimiters.sep,
        next: state,
    })

    // img tags are parsed via HTML (!)
    return states({
        main: {
            blockopen,
            inlineopen,
            text: outerText,
        },

        blockkey: {
            keyname,
            sep: sep('blocktag'),
            close: closenext('mainblock'),
        },

        inlinekey: {
            keyname,
            sep: sep('inlinetag'),
            close: closepop,
        },

        blocktag: {
            blockopen,
            inlineopen,
            close: closenext('mainblock'),
            text,
        },

        inlinetag: {
            blockopen,
            inlineopen,
            close: closepop,
            text,
        },

        mainblock: {
            blockopen,
            inlineopen,
            blockclose,
        },

        blockclose: {
            keyname,
            close: closepop,
        },
    }) as Lexer
}
