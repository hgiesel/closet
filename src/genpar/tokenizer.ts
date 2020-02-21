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

  trueLit: ['#t', '#true'],
  falseLit: ['#f', '#false'],
  nil: ['#n', '#nil'],

  string: {
    match: /"(?:\\["\\rn]|[^"\\\n])*?"/u,
    value: x => x.slice(1, -1),
  },
  number: [
    /[+-]?(?:0|[1-9][0-9]*)/u,                // 123
    /[+-]?(?:(?:0|[1-9][0-9]*)?\.[0-9]+)/u,   // [123].123
    /[+-]?(?:(?:0|[1-9][0-9]*)\.[0-9]*)/u,    // 123.[123]
  ],

  symbol: {
    match: /(?:[_-~./!?+<=>*%@$|^a-zA-Z]|&lt;|&gt;)(?:[_-~./!?+<=>*%@$|^a-zA-Z0-9]|&lt;|&gt;)*/u,
    type: moo.keywords({
      'rsrvd-def': 'def',
      'rsrvd-fn': 'fn',
      'rsrvd-defn': 'defn',
      'rsrvd-case': 'case',
      'rsrvd-cond': 'cond',
      'rsrvd-do': 'do',
      'rsrvd-dotimes': 'dotimes',
    }),
  },
  keyword: {
    match: /:[_-~./!?+<=>*%@$|^a-zA-Z][_-~./!?+<=>*%@$|^a-zA-Z0-9]*/u,
    value: x => x.slice(1),
  },
})

export default lexer
