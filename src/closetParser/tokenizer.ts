import moo from 'moo'

export const lexer = moo.compile({
    ws: {
        match: /(?:&nbsp;|,|<[^>]*?>|[ \t\n]|\/\*.*\*\/)+/u,
        lineBreaks: true,
    },

    lparen: '(',
    hashParen: '#(',
    rparen: ')',

    lbracket: '[',
    rbracket: ']',

    lbrace: '{',
    rbrace: '}',

    quote: '\'',
    amp: '&',
    at: '@',

    string: {
        match: /"(?:\\["\\rn]|[^"\\\n])*?"/u,
            value: (x: string) => x.slice(1, -1),
        },
    number: [
        /[+-]?(?:(?:0|[1-9][0-9]*)\.[0-9]+)/u,    // 123.123
        /[+-]?(?:(?:0|[1-9][0-9]*)?\.[0-9]+)/u,   // [123].123
        /[+-]?(?:(?:0|[1-9][0-9]*)\.[0-9]*)/u,    // 123.[123]
        /[+-]?(?:0|[1-9][0-9]*)/u,                // 123
    ],

    symbol: {
        match: /(?:[-_.!?+*/<=>%|~^a-zA-Z]|&lt;|&gt;)(?:[-_.!?+*/<=>%|~^a-zA-Z0-9]|&lt;|&gt;)*/u,
        type: moo.keywords({
            'defSym': 'def',
            'fnSym': 'fn',
            'defnSym': 'defn',

            'doSym': 'do',
            'letSym': 'let',

            'ifSym': 'if',
            'condSym': 'cond',
            'caseSym': 'case',

            'forSym': 'for',
            'doseqSym': 'doseq',

            'arrowSym': '->',
            'darrowSym': '->>',
        }),
    },

    keyword: {
        match: /:(?:[-_.!?+*/<=>%|~^a-zA-Z]|&lt;|&gt;)(?:[-_.!?+*/<=>%|~^a-zA-Z0-9]|&lt;|&gt;)*/u,
        value: (x: string) => x.slice(1),
    },

    dispatch: {
        match: /#(?:[-_.!?+*/<=>%|~^a-zA-Z]|&lt;|&gt;)(?:[-_.!?+*/<=>%|~^a-zA-Z0-9]|&lt;|&gt;)*/u,
        type: moo.keywords({
            'trueLit': '#true',
            'falseLit': '#false',
            'nilLit': '#none',
            'infLit': '#inf',
            'negInfLit': '#-inf',
            'nanLit': '#nan',
        }),
        value: (x: string) => x.slice(1),
    },

    regex: {
        match: /#"[\s\S]*"/u,
        value: (x: string) => x.slice(2, -1),
    },
})

export default lexer
