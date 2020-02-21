// Generated automatically by nearley, version 2.19.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }
declare var lparen: any;
declare var rparen: any;
declare var lbracket: any;
declare var rbracket: any;
declare var lbrace: any;
declare var rbrace: any;
declare var nil: any;
declare var some: any;
declare var quote: any;
declare var trueLit: any;
declare var falseLit: any;
declare var number: any;
declare var string: any;
declare var symbol: any;
declare var keyword: any;
declare var ws: any;

import {
    mkUnit,
    mkBool,
    mkNumber,
    mkSymbol,
    mkKeyword,
    mkString,

    mkQuoted,
    mkOptional,

    mkList,
    mkVector,
    mkMap,

    mkProg,
} from '../constructors'

import tokenizer from './tokenizer'

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
    {"name": "prog", "symbols": ["stmts"], "postprocess": ([stmts]) => mkProg(stmts)},
    {"name": "stmts$ebnf$1", "symbols": []},
    {"name": "stmts$ebnf$1$subexpression$1$macrocall$2", "symbols": ["lit"]},
    {"name": "stmts$ebnf$1$subexpression$1$macrocall$1", "symbols": ["stmts$ebnf$1$subexpression$1$macrocall$2", "_"], "postprocess": id},
    {"name": "stmts$ebnf$1$subexpression$1", "symbols": ["stmts$ebnf$1$subexpression$1$macrocall$1"]},
    {"name": "stmts$ebnf$1", "symbols": ["stmts$ebnf$1", "stmts$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "stmts", "symbols": ["_", "stmts$ebnf$1"], "postprocess": ([_, stmts]) => stmts},
    {"name": "lit", "symbols": ["list"]},
    {"name": "lit", "symbols": ["vector"]},
    {"name": "lit", "symbols": ["map"]},
    {"name": "lit", "symbols": ["quoted"]},
    {"name": "lit", "symbols": ["optional"]},
    {"name": "lit", "symbols": ["number"]},
    {"name": "lit", "symbols": ["string"]},
    {"name": "lit", "symbols": ["symbol"]},
    {"name": "lit", "symbols": ["keyword"]},
    {"name": "lit", "symbols": ["bool"]},
    {"name": "mapIdentifier", "symbols": ["string"]},
    {"name": "mapIdentifier", "symbols": ["keyword"]},
    {"name": "list$ebnf$1$macrocall$2", "symbols": ["lit"]},
    {"name": "list$ebnf$1$macrocall$1", "symbols": ["list$ebnf$1$macrocall$2", "_"], "postprocess": id},
    {"name": "list$ebnf$1", "symbols": ["list$ebnf$1$macrocall$1"]},
    {"name": "list$ebnf$1$macrocall$4", "symbols": ["lit"]},
    {"name": "list$ebnf$1$macrocall$3", "symbols": ["list$ebnf$1$macrocall$4", "_"], "postprocess": id},
    {"name": "list$ebnf$1", "symbols": ["list$ebnf$1", "list$ebnf$1$macrocall$3"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "list", "symbols": [(tokenizer.has("lparen") ? {type: "lparen"} : lparen), "_", "list$ebnf$1", (tokenizer.has("rparen") ? {type: "rparen"} : rparen)]},
    {"name": "unit", "symbols": [(tokenizer.has("lparen") ? {type: "lparen"} : lparen), "_", (tokenizer.has("rparen") ? {type: "rparen"} : rparen)], "postprocess": () => mkUnit()},
    {"name": "vector$ebnf$1", "symbols": []},
    {"name": "vector$ebnf$1$macrocall$2", "symbols": ["lit"]},
    {"name": "vector$ebnf$1$macrocall$1", "symbols": ["vector$ebnf$1$macrocall$2", "_"], "postprocess": id},
    {"name": "vector$ebnf$1", "symbols": ["vector$ebnf$1", "vector$ebnf$1$macrocall$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "vector", "symbols": [(tokenizer.has("lbracket") ? {type: "lbracket"} : lbracket), "_", "vector$ebnf$1", (tokenizer.has("rbracket") ? {type: "rbracket"} : rbracket)]},
    {"name": "map$ebnf$1", "symbols": []},
    {"name": "map$ebnf$1$subexpression$1$macrocall$2", "symbols": ["mapIdentifier"]},
    {"name": "map$ebnf$1$subexpression$1$macrocall$1", "symbols": ["map$ebnf$1$subexpression$1$macrocall$2", "_"], "postprocess": id},
    {"name": "map$ebnf$1$subexpression$1$macrocall$4", "symbols": ["lit"]},
    {"name": "map$ebnf$1$subexpression$1$macrocall$3", "symbols": ["map$ebnf$1$subexpression$1$macrocall$4", "_"], "postprocess": id},
    {"name": "map$ebnf$1$subexpression$1", "symbols": ["map$ebnf$1$subexpression$1$macrocall$1", "map$ebnf$1$subexpression$1$macrocall$3"]},
    {"name": "map$ebnf$1", "symbols": ["map$ebnf$1", "map$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "map", "symbols": [(tokenizer.has("lbrace") ? {type: "lbrace"} : lbrace), "_", "map$ebnf$1", (tokenizer.has("rbrace") ? {type: "rbrace"} : rbrace)]},
    {"name": "optional", "symbols": [(tokenizer.has("nil") ? {type: "nil"} : nil)]},
    {"name": "optional", "symbols": [(tokenizer.has("some") ? {type: "some"} : some), "lit"]},
    {"name": "quoted", "symbols": [(tokenizer.has("quote") ? {type: "quote"} : quote), "lit"]},
    {"name": "bool", "symbols": [(tokenizer.has("trueLit") ? {type: "trueLit"} : trueLit)], "postprocess": () => mkBool(true)},
    {"name": "bool", "symbols": [(tokenizer.has("falseLit") ? {type: "falseLit"} : falseLit)], "postprocess": () => mkBool(false)},
    {"name": "number", "symbols": [(tokenizer.has("number") ? {type: "number"} : number)], "postprocess": ([num]) => mkNumber(num)},
    {"name": "string", "symbols": [(tokenizer.has("string") ? {type: "string"} : string)], "postprocess": ([str]) => mkString(str)},
    {"name": "symbol", "symbols": [(tokenizer.has("symbol") ? {type: "symbol"} : symbol)], "postprocess": id},
    {"name": "keyword", "symbols": [(tokenizer.has("keyword") ? {type: "keyword"} : keyword)], "postprocess": id},
    {"name": "_$ebnf$1", "symbols": [(tokenizer.has("ws") ? {type: "ws"} : ws)], "postprocess": id},
    {"name": "_$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": function() { return null }}
  ],
  ParserStart: "prog",
};

export default grammar;
