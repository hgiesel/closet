import moo from 'moo'

export const lexer = moo.compile({
    ws: /(?:&nbsp;|,|<[^>]*?>|[ \t])+/u,

    lparen: '(',
    rparen: ')',
    lbracket: '[',
    rbracket: ']',
    lbrace: '{',
    rbrace: '}',
    quote: '\'',
    some: '&',

    string: {
        match: /"(?:\\["\\rn]|[^"\\\n])*?"/u,
            value: (x: string) => x.slice(1, -1),
        },
    number: [
        /[+-]?(?:0|[1-9][0-9]*)/u,                // 123
        /[+-]?(?:(?:0|[1-9][0-9]*)?\.[0-9]+)/u,   // [123].123
        /[+-]?(?:(?:0|[1-9][0-9]*)\.[0-9]*)/u,    // 123.[123]
    ],

    symbol: {
        match: /(?:[_-~./!?+<=>*%@$|^a-zA-Z]|&lt;|&gt;)(?:[_-~./!?+<=>*%@$|^a-zA-Z0-9]|&lt;|&gt;)*/u,
        type: moo.keywords({
            'defSym': 'def',
            'doSym': 'do',
            'letSym': 'let',

            'fnSym': 'fn',
            'defnSym': 'defn',

            'ifSym': 'if',
            'caseSym': 'case',
            'condSym': 'cond',
        }),
    },

    keyword: {
        match: /:[_-~./!?+<=>*%@$|^a-zA-Z][_-~./!?+<=>*%@$|^a-zA-Z0-9]*/u,
        value: (x: string) => x.slice(1),
    },

    dispatch: {
        match: /#[_-~./!?+<=>*%@$|^a-zA-Z][_-~./!?+<=>*%@$|^a-zA-Z0-9]*/u,
        type: moo.keywords({
            'trueLit': ['#true', '#t'],
            'falseLit': ['#false', '#f'],
            'nilLit': ['#nil', '#n'],
        }),
        value: (x: string) => x.slice(1),
    },
})

export default lexer
