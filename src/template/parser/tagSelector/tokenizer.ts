import moo from 'moo'

export const tagSelectorTokenizer = moo.compile({
    text: {
        match: /[a-zA-Z_/]+/u,
    },

    escapeseq: {
        match: /%\w/u,
    },

    star: {
        match: '*',
    },

    digits: {
        match: /\d+/u
    },

    groupOpen: {
        match: '{',
    },

    groupAlternative: {
        match: ',',
    },

    multiplierSeq: {
        match: '*n+',
    },

    rangeSpecifier: {
        match: /-/u,
    },

    groupClose: {
        match: '}',
    },

    occurSep: {
        match: ':',
    },
})

export default tagSelectorTokenizer
