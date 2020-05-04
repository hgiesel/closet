// Generated automatically by nearley, version 2.19.2
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }
declare var EOF: any;
declare var tagend: any;
declare var tagstart: any;
declare var argsep: any;
declare var intext: any;
declare var altsep: any;
declare var text: any;

import tokenizer from './tokenizer'
import initTagKeeper from './tagKeeper'

const tagKeeper = initTagKeeper()

interface NearleyToken {  value: any;
  [key: string]: any;
};

interface NearleyLexer {
  reset: (chunk: string, info: any) => void;
  next: () => NearleyToken | undefined;
  save: () => any;
  formatError: (token: NearleyToken) => string;
  has: (tokenType: string) => boolean;
};

interface NearleyRule {
  name: string;
  symbols: NearleySymbol[];
  postprocess?: (d: any[], loc?: number, reject?: {}) => any;
};

type NearleySymbol = string | { literal: any } | { test: (token: any) => boolean };

interface Grammar {
  Lexer: NearleyLexer | undefined;
  ParserRules: NearleyRule[];
  ParserStart: string;
};

const grammar: Grammar = {
  Lexer: tokenizer,
  ParserRules: [
    {"name": "start", "symbols": ["content", (tokenizer.has("EOF") ? {type: "EOF"} : EOF)], "postprocess": () => tagKeeper.stop().value},
    {"name": "content$ebnf$1", "symbols": []},
    {"name": "content$ebnf$1$subexpression$1", "symbols": ["tag", "_"]},
    {"name": "content$ebnf$1", "symbols": ["content$ebnf$1", "content$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "content", "symbols": ["_", "content$ebnf$1"]},
    {"name": "tag", "symbols": ["tagstart", "inner", (tokenizer.has("tagend") ? {type: "tagend"} : tagend)], "postprocess":  ([startToken,tag,endToken]) => [[
            startToken[0] /* '[[' */,
            tag,
            endToken.value /* ']]' */,
        ], tagKeeper.endToken(endToken.offset, tag)] },
    {"name": "tagstart", "symbols": [(tokenizer.has("tagstart") ? {type: "tagstart"} : tagstart)], "postprocess": ([startToken]) => [startToken.value, tagKeeper.startToken(startToken.offset)]},
    {"name": "inner$ebnf$1", "symbols": []},
    {"name": "inner$ebnf$1$subexpression$1", "symbols": [(tokenizer.has("argsep") ? {type: "argsep"} : argsep), "args"]},
    {"name": "inner$ebnf$1", "symbols": ["inner$ebnf$1", "inner$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "inner", "symbols": ["key", "inner$ebnf$1"], "postprocess": ([key,args]) => [key, ...args.map(v => v[1])]},
    {"name": "key$ebnf$1", "symbols": [(tokenizer.has("intext") ? {type: "intext"} : intext)]},
    {"name": "key$ebnf$1", "symbols": ["key$ebnf$1", (tokenizer.has("intext") ? {type: "intext"} : intext)], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "key", "symbols": ["key$ebnf$1"], "postprocess": ([vs]) => vs.map(v => v.value).join('')},
    {"name": "args$ebnf$1", "symbols": []},
    {"name": "args$ebnf$1$subexpression$1", "symbols": [(tokenizer.has("altsep") ? {type: "altsep"} : altsep), "val"]},
    {"name": "args$ebnf$1", "symbols": ["args$ebnf$1", "args$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "args", "symbols": ["val", "args$ebnf$1"], "postprocess": ([first, rest]) => [first, ...rest.map(v => v[1])]},
    {"name": "val$ebnf$1", "symbols": []},
    {"name": "val$ebnf$1$subexpression$1", "symbols": ["tag", "_in"]},
    {"name": "val$ebnf$1", "symbols": ["val$ebnf$1", "val$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "val", "symbols": ["_in", "val$ebnf$1"], "postprocess": 
        ([first,rest]) => rest.reduce((accu, v) => [accu, [v[0][0][0], [v[0][0][1][0], v[0][0][1].slice(1).flat().join('||')].join('::'), v[0][0][2]].join(''), v[1]].join(''), first)
        },
    {"name": "_in$ebnf$1", "symbols": []},
    {"name": "_in$ebnf$1", "symbols": ["_in$ebnf$1", (tokenizer.has("intext") ? {type: "intext"} : intext)], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "_in", "symbols": ["_in$ebnf$1"], "postprocess": ([vs]) => vs.map(v => v.value).join('')},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", (tokenizer.has("text") ? {type: "text"} : text)], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": () => null}
  ],
  ParserStart: "start",
};

export default grammar;
