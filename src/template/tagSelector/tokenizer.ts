import type { Lexer } from "moo";

import { compile } from "moo";

export const tagSelectorTokenizer: Lexer = compile({
    text: {
        match: /[a-zA-Z_]+/u,
    },

    numDigits: {
        match: /\d+(?=:|$)/u,
    },

    digits: {
        match: /\d+/u,
    },

    slash: {
        match: "/",
    },

    escapeseq: {
        match: /%\w/u,
    },

    // has to come before star
    multiplierSeq: {
        match: /\*n\+/u,
    },

    allStar: {
        match: /^\*$/u,
    },

    numStar: {
        match: /\*(?=:|$)/u,
    },

    star: {
        match: "*",
    },

    groupOpen: {
        match: "{",
    },

    groupAlternative: {
        match: ",",
    },

    rangeSpecifier: {
        match: /-/u,
    },

    numGroupClose: {
        match: /\}(?=:|$)/u,
    },

    groupClose: {
        match: "}",
    },

    occurSep: {
        match: ":",
    },
});
