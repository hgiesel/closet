// Generated automatically by nearley, version 2.19.2
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
declare var nilLit: any;
declare var amp: any;
declare var quote: any;
declare var at: any;
declare var trueLit: any;
declare var falseLit: any;
declare var number: any;
declare var infLit: any;
declare var negInfLit: any;
declare var nanLit: any;
declare var string: any;
declare var symbol: any;
declare var keyword: any;
declare var regex: any;
declare var defSym: any;
declare var fnSym: any;
declare var defnSym: any;
declare var doSym: any;
declare var letSym: any;
declare var ifSym: any;
declare var condSym: any;
declare var caseSym: any;
declare var forSym: any;
declare var doseqSym: any;
declare var arrowSym: any;
declare var darrowSym: any;
declare var hashParen: any;
declare var ws: any;

import {
    mkUnit,
    mkBool,
    mkNumber,
    mkSymbol,
    mkKeyword,
    mkString,
    mkRegex,

    mkQuoted,
    mkOptional,

    mkList,
    mkVector,
    mkMap,
    mkFunction,
    mkShcutFunction,

    mkDef,
    mkDo,
    mkLet,

    mkIf,
    mkCond,
    mkCase,

    mkFor,
    mkDoseq,
    mkThreadFirst,
    mkThreadLast,
} from '../constructors'

import {
    shcutFuncArity,
} from './utils'

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
    {"name": "start", "symbols": ["prog"], "postprocess": id},
    {"name": "prog$ebnf$1", "symbols": []},
    {"name": "prog$ebnf$1$subexpression$1", "symbols": ["expr", "_"]},
    {"name": "prog$ebnf$1", "symbols": ["prog$ebnf$1", "prog$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "prog", "symbols": ["_", "prog$ebnf$1"], "postprocess": 
        ([,vals]) => mkDo(vals.map(id))
        },
    {"name": "expr", "symbols": ["lit"], "postprocess": id},
    {"name": "expr", "symbols": ["shCutFn"], "postprocess": id},
    {"name": "lit$macrocall$2", "symbols": ["list"]},
    {"name": "lit$macrocall$1", "symbols": [(tokenizer.has("lparen") ? {type: "lparen"} : lparen), "_", "lit$macrocall$2", (tokenizer.has("rparen") ? {type: "rparen"} : rparen)]},
    {"name": "lit", "symbols": ["lit$macrocall$1"], "postprocess": ([[,,[val]]]) => val},
    {"name": "lit", "symbols": ["vector"], "postprocess": id},
    {"name": "lit", "symbols": ["map"], "postprocess": id},
    {"name": "lit", "symbols": ["quoted"], "postprocess": id},
    {"name": "lit", "symbols": ["optional"], "postprocess": id},
    {"name": "lit", "symbols": ["deref"], "postprocess": id},
    {"name": "lit", "symbols": ["number"], "postprocess": id},
    {"name": "lit", "symbols": ["string"], "postprocess": id},
    {"name": "lit", "symbols": ["regex"], "postprocess": id},
    {"name": "lit", "symbols": ["symbol"], "postprocess": id},
    {"name": "lit", "symbols": ["keyword"], "postprocess": id},
    {"name": "lit", "symbols": ["bool"], "postprocess": id},
    {"name": "vector$macrocall$2$ebnf$1", "symbols": []},
    {"name": "vector$macrocall$2$ebnf$1$subexpression$1", "symbols": ["expr", "_"]},
    {"name": "vector$macrocall$2$ebnf$1", "symbols": ["vector$macrocall$2$ebnf$1", "vector$macrocall$2$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "vector$macrocall$2", "symbols": ["vector$macrocall$2$ebnf$1"]},
    {"name": "vector$macrocall$1", "symbols": [(tokenizer.has("lbracket") ? {type: "lbracket"} : lbracket), "_", "vector$macrocall$2", (tokenizer.has("rbracket") ? {type: "rbracket"} : rbracket)]},
    {"name": "vector", "symbols": ["vector$macrocall$1"], "postprocess": 
        ([[,,[vals]]]) => mkVector(vals.map(id))
        },
    {"name": "map$macrocall$2$ebnf$1", "symbols": []},
    {"name": "map$macrocall$2$ebnf$1$subexpression$1", "symbols": ["mapIdentifier", "_", "expr", "_"]},
    {"name": "map$macrocall$2$ebnf$1", "symbols": ["map$macrocall$2$ebnf$1", "map$macrocall$2$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "map$macrocall$2", "symbols": ["map$macrocall$2$ebnf$1"]},
    {"name": "map$macrocall$1", "symbols": [(tokenizer.has("lbrace") ? {type: "lbrace"} : lbrace), "_", "map$macrocall$2", (tokenizer.has("rbrace") ? {type: "rbrace"} : rbrace)]},
    {"name": "map", "symbols": ["map$macrocall$1"], "postprocess": 
        ([[,,[vals]]]) => mkMap(vals.map(v => [v[0], v[2]]))
        },
    {"name": "mapIdentifier", "symbols": ["string"], "postprocess": id},
    {"name": "mapIdentifier", "symbols": ["keyword"], "postprocess": id},
    {"name": "mapIdentifier", "symbols": ["number"], "postprocess": id},
    {"name": "optional", "symbols": [(tokenizer.has("nilLit") ? {type: "nilLit"} : nilLit)], "postprocess": () => mkOptional(null)},
    {"name": "optional", "symbols": [(tokenizer.has("amp") ? {type: "amp"} : amp), "expr"], "postprocess": ([,val]) => mkOptional(val)},
    {"name": "quoted", "symbols": [(tokenizer.has("quote") ? {type: "quote"} : quote), "expr"], "postprocess": ([,quot]) => mkQuoted(quot)},
    {"name": "deref", "symbols": [(tokenizer.has("at") ? {type: "at"} : at), "expr"], "postprocess": ([,expr]) => mkList(mkSymbol('deref'), [expr])},
    {"name": "bool", "symbols": [(tokenizer.has("trueLit") ? {type: "trueLit"} : trueLit)], "postprocess": () => mkBool(true)},
    {"name": "bool", "symbols": [(tokenizer.has("falseLit") ? {type: "falseLit"} : falseLit)], "postprocess": () => mkBool(false)},
    {"name": "number", "symbols": [(tokenizer.has("number") ? {type: "number"} : number)], "postprocess": ([num]) => mkNumber(num.value)},
    {"name": "number", "symbols": [(tokenizer.has("infLit") ? {type: "infLit"} : infLit)], "postprocess": ([num]) => mkNumber(Infinity)},
    {"name": "number", "symbols": [(tokenizer.has("negInfLit") ? {type: "negInfLit"} : negInfLit)], "postprocess": ([num]) => mkNumber(-Infinity)},
    {"name": "number", "symbols": [(tokenizer.has("nanLit") ? {type: "nanLit"} : nanLit)], "postprocess": ([num]) => mkNumber(NaN)},
    {"name": "string", "symbols": [(tokenizer.has("string") ? {type: "string"} : string)], "postprocess": ([str]) => mkString(str.value)},
    {"name": "symbol", "symbols": [(tokenizer.has("symbol") ? {type: "symbol"} : symbol)], "postprocess": ([sym]) => mkSymbol(sym.value)},
    {"name": "keyword", "symbols": [(tokenizer.has("keyword") ? {type: "keyword"} : keyword)], "postprocess": ([kw]) => mkKeyword(kw.value)},
    {"name": "regex", "symbols": [(tokenizer.has("regex") ? {type: "regex"} : regex)], "postprocess": ([re]) => mkRegex(re.value)},
    {"name": "list", "symbols": ["def"], "postprocess": id},
    {"name": "list", "symbols": ["fn"], "postprocess": id},
    {"name": "list", "symbols": ["defn"], "postprocess": id},
    {"name": "list", "symbols": ["do"], "postprocess": id},
    {"name": "list", "symbols": ["let"], "postprocess": id},
    {"name": "list", "symbols": ["if"], "postprocess": id},
    {"name": "list", "symbols": ["case"], "postprocess": id},
    {"name": "list", "symbols": ["cond"], "postprocess": id},
    {"name": "list", "symbols": ["for"], "postprocess": id},
    {"name": "list", "symbols": ["doseq"], "postprocess": id},
    {"name": "list", "symbols": ["threadfirst"], "postprocess": id},
    {"name": "list", "symbols": ["threadlast"], "postprocess": id},
    {"name": "list", "symbols": ["op"], "postprocess": id},
    {"name": "list", "symbols": ["unit"], "postprocess": id},
    {"name": "def", "symbols": [(tokenizer.has("defSym") ? {type: "defSym"} : defSym), "_", "symbol", "_", "expr", "_"], "postprocess": 
        ([,,ident,,val]) => mkDef(ident, val)
        },
    {"name": "fn$macrocall$2$ebnf$1", "symbols": []},
    {"name": "fn$macrocall$2$ebnf$1$subexpression$1", "symbols": ["symbol", "_"]},
    {"name": "fn$macrocall$2$ebnf$1", "symbols": ["fn$macrocall$2$ebnf$1", "fn$macrocall$2$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "fn$macrocall$2", "symbols": ["fn$macrocall$2$ebnf$1"]},
    {"name": "fn$macrocall$1", "symbols": [(tokenizer.has("lbracket") ? {type: "lbracket"} : lbracket), "_", "fn$macrocall$2", (tokenizer.has("rbracket") ? {type: "rbracket"} : rbracket)]},
    {"name": "fn", "symbols": [(tokenizer.has("fnSym") ? {type: "fnSym"} : fnSym), "_", "fn$macrocall$1", "_", "expr", "_"], "postprocess": 
        ([,,[,,params],,body]) => mkFunction(`fn_${Math.floor(Math.random() * 2e6)}`, params[0].map(id), body)
        },
    {"name": "defn$macrocall$2$ebnf$1", "symbols": []},
    {"name": "defn$macrocall$2$ebnf$1$subexpression$1", "symbols": ["symbol", "_"]},
    {"name": "defn$macrocall$2$ebnf$1", "symbols": ["defn$macrocall$2$ebnf$1", "defn$macrocall$2$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "defn$macrocall$2", "symbols": ["defn$macrocall$2$ebnf$1"]},
    {"name": "defn$macrocall$1", "symbols": [(tokenizer.has("lbracket") ? {type: "lbracket"} : lbracket), "_", "defn$macrocall$2", (tokenizer.has("rbracket") ? {type: "rbracket"} : rbracket)]},
    {"name": "defn", "symbols": [(tokenizer.has("defnSym") ? {type: "defnSym"} : defnSym), "_", "symbol", "_", "defn$macrocall$1", "_", "expr", "_"], "postprocess": 
        ([,,ident,,[,,params],,body]) => mkDef(ident, mkFunction(ident, params[0].map(id), body))
        },
    {"name": "do$ebnf$1", "symbols": []},
    {"name": "do$ebnf$1$subexpression$1", "symbols": ["expr", "_"]},
    {"name": "do$ebnf$1", "symbols": ["do$ebnf$1", "do$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "do", "symbols": [(tokenizer.has("doSym") ? {type: "doSym"} : doSym), "_", "do$ebnf$1"], "postprocess": 
        ([,,vals]) => mkDo(vals.map(id))
        },
    {"name": "let$macrocall$2$ebnf$1", "symbols": []},
    {"name": "let$macrocall$2$ebnf$1$subexpression$1", "symbols": ["symbol", "_", "expr", "_"]},
    {"name": "let$macrocall$2$ebnf$1", "symbols": ["let$macrocall$2$ebnf$1", "let$macrocall$2$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "let$macrocall$2", "symbols": ["let$macrocall$2$ebnf$1"]},
    {"name": "let$macrocall$1", "symbols": [(tokenizer.has("lbracket") ? {type: "lbracket"} : lbracket), "_", "let$macrocall$2", (tokenizer.has("rbracket") ? {type: "rbracket"} : rbracket)]},
    {"name": "let$ebnf$1", "symbols": []},
    {"name": "let$ebnf$1$subexpression$1", "symbols": ["expr", "_"]},
    {"name": "let$ebnf$1", "symbols": ["let$ebnf$1", "let$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "let", "symbols": [(tokenizer.has("letSym") ? {type: "letSym"} : letSym), "_", "let$macrocall$1", "_", "let$ebnf$1"], "postprocess": 
        ([,,[,,[params]],,body]) => mkLet(params.map(v => [v[0], v[2]]), mkDo(body.map(v => v[0])))
        },
    {"name": "if$ebnf$1$subexpression$1", "symbols": ["expr", "_"]},
    {"name": "if$ebnf$1", "symbols": ["if$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "if$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "if", "symbols": [(tokenizer.has("ifSym") ? {type: "ifSym"} : ifSym), "_", "expr", "_", "expr", "_", "if$ebnf$1"], "postprocess": 
        ([,,pred,,thenClause,,maybeElseClause]) => mkIf(
            pred,
            thenClause,
            maybeElseClause
                ? maybeElseClause[0]
                : mkUnit(),
        )
        },
    {"name": "cond$ebnf$1", "symbols": []},
    {"name": "cond$ebnf$1$subexpression$1", "symbols": ["expr", "_", "expr", "_"]},
    {"name": "cond$ebnf$1", "symbols": ["cond$ebnf$1", "cond$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "cond", "symbols": [(tokenizer.has("condSym") ? {type: "condSym"} : condSym), "_", "cond$ebnf$1"], "postprocess": 
        ([,,vals]) => mkCond(vals.map(v => [v[0], v[2]]))
        },
    {"name": "case$ebnf$1", "symbols": []},
    {"name": "case$ebnf$1$subexpression$1", "symbols": ["expr", "_", "expr", "_"]},
    {"name": "case$ebnf$1", "symbols": ["case$ebnf$1", "case$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "case", "symbols": [(tokenizer.has("caseSym") ? {type: "caseSym"} : caseSym), "_", "symbol", "_", "case$ebnf$1"], "postprocess": 
        ([,,sym,,vals]) => mkCase(sym, vals.map(v => [v[0], v[2]]))
        },
    {"name": "for$macrocall$2$ebnf$1", "symbols": []},
    {"name": "for$macrocall$2$ebnf$1$subexpression$1", "symbols": ["symbol", "_", "expr", "_"]},
    {"name": "for$macrocall$2$ebnf$1", "symbols": ["for$macrocall$2$ebnf$1", "for$macrocall$2$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "for$macrocall$2", "symbols": ["for$macrocall$2$ebnf$1"]},
    {"name": "for$macrocall$1", "symbols": [(tokenizer.has("lbracket") ? {type: "lbracket"} : lbracket), "_", "for$macrocall$2", (tokenizer.has("rbracket") ? {type: "rbracket"} : rbracket)]},
    {"name": "for", "symbols": [(tokenizer.has("forSym") ? {type: "forSym"} : forSym), "_", "for$macrocall$1", "_", "expr", "_"], "postprocess": 
        ([,,[,,[params]],,body]) => mkFor(params.map(v => [v[0], v[2]]), body)
        },
    {"name": "doseq$macrocall$2$ebnf$1", "symbols": []},
    {"name": "doseq$macrocall$2$ebnf$1$subexpression$1", "symbols": ["symbol", "_", "expr", "_"]},
    {"name": "doseq$macrocall$2$ebnf$1", "symbols": ["doseq$macrocall$2$ebnf$1", "doseq$macrocall$2$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "doseq$macrocall$2", "symbols": ["doseq$macrocall$2$ebnf$1"]},
    {"name": "doseq$macrocall$1", "symbols": [(tokenizer.has("lbracket") ? {type: "lbracket"} : lbracket), "_", "doseq$macrocall$2", (tokenizer.has("rbracket") ? {type: "rbracket"} : rbracket)]},
    {"name": "doseq", "symbols": [(tokenizer.has("doseqSym") ? {type: "doseqSym"} : doseqSym), "_", "doseq$macrocall$1", "_", "expr", "_"], "postprocess": 
        ([,,[,,[params]],,body]) => mkDoseq(params.map(v => [v[0], v[2]]), body)
        },
    {"name": "threadfirst$ebnf$1", "symbols": []},
    {"name": "threadfirst$ebnf$1$subexpression$1", "symbols": ["expr", "_"]},
    {"name": "threadfirst$ebnf$1", "symbols": ["threadfirst$ebnf$1", "threadfirst$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "threadfirst", "symbols": [(tokenizer.has("arrowSym") ? {type: "arrowSym"} : arrowSym), "_", "expr", "_", "threadfirst$ebnf$1"], "postprocess": 
        ([,,val,,pipes]) => mkThreadFirst(val, pipes.map(id))
        },
    {"name": "threadlast$ebnf$1", "symbols": []},
    {"name": "threadlast$ebnf$1$subexpression$1", "symbols": ["expr", "_"]},
    {"name": "threadlast$ebnf$1", "symbols": ["threadlast$ebnf$1", "threadlast$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "threadlast", "symbols": [(tokenizer.has("darrowSym") ? {type: "darrowSym"} : darrowSym), "_", "expr", "_", "threadlast$ebnf$1"], "postprocess": 
        ([,,val,,pipes]) => mkThreadLast(val, pipes.map(id))
        },
    {"name": "op$ebnf$1$subexpression$1", "symbols": ["expr", "_"]},
    {"name": "op$ebnf$1", "symbols": ["op$ebnf$1$subexpression$1"]},
    {"name": "op$ebnf$1$subexpression$2", "symbols": ["expr", "_"]},
    {"name": "op$ebnf$1", "symbols": ["op$ebnf$1", "op$ebnf$1$subexpression$2"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "op", "symbols": ["op$ebnf$1"], "postprocess": 
        ([vals]) => mkList(id(id(vals)), vals.slice(1).map(id))
        },
    {"name": "unit", "symbols": ["_"], "postprocess": 
        () => mkUnit()
        },
    {"name": "shCutFn$ebnf$1$subexpression$1", "symbols": ["lit", "_"]},
    {"name": "shCutFn$ebnf$1", "symbols": ["shCutFn$ebnf$1$subexpression$1"]},
    {"name": "shCutFn$ebnf$1$subexpression$2", "symbols": ["lit", "_"]},
    {"name": "shCutFn$ebnf$1", "symbols": ["shCutFn$ebnf$1", "shCutFn$ebnf$1$subexpression$2"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "shCutFn", "symbols": [(tokenizer.has("hashParen") ? {type: "hashParen"} : hashParen), "_", "shCutFn$ebnf$1", (tokenizer.has("rparen") ? {type: "rparen"} : rparen)], "postprocess": 
        ([,,vals]) => {
            const lst = mkList(vals[0][0], vals.slice(1).map(id))
            return mkShcutFunction(`fn_${Math.floor(Math.random() * 2e6)}`, shcutFuncArity(lst), lst)
        }
        },
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", (tokenizer.has("ws") ? {type: "ws"} : ws)], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": () => null},
    {"name": "__$ebnf$1", "symbols": [(tokenizer.has("ws") ? {type: "ws"} : ws)]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", (tokenizer.has("ws") ? {type: "ws"} : ws)], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": () => null}
  ],
  ParserStart: "start",
};

export default grammar;
