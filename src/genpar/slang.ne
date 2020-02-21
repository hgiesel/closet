@{%
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
    mkFunction,

    mkProg,
    mkDef,
    mkDo,
    mkLet,
} from '../constructors'

import tokenizer from './tokenizer'
%}

@preprocessor typescript
@lexer tokenizer

list[X] -> %lparen _ $X %rparen
vector[X] -> %lbracket _ $X %rbracket
map[X] -> %lbrace _ $X  %rbrace

#################################

start -> prog {% id %}

prog -> exprs {% ([exprs]) => mkProg(exprs) %}

exprs -> _ (expr _):* {% ([, exprs]) => exprs.map(([lit]) => lit) %}
expr -> stmt {% id %}
      | lit {% id %}

stmt -> def {% id %}
      | fn {% id %}
      | defn {% id %}
      | do {% id %}
      | let {% id %}

def -> %lparen _ %defSym _ symbol _ expr _ %rparen {%
    ([,,,,id,,val]) => mkDef(id, val)
%}

fn -> %lparen _ %fnSym _ vector[(symbol _):*] _ expr _ %rparen {%
    ([,,,,[,,params],,body]) => mkFunction(params[0].map(id), body),
%}

defn -> %lparen _ %defnSym _ symbol _ vector[(symbol _):*] _ expr _ %rparen {%
    ([,,,,id,,[,,params],,body]) => mkDef(id, mkFunction(params[0].map(id), body)),
%}

do -> %lparen _ %doSym _ (expr _):* %rparen {%
    ([,,,,vals]) => mkDo(vals.map(id))
%}

let -> %lparen _ %letSym _ vector[(symbol _ expr _):*] _ (expr _):* %rparen {%
    ([,,,,[,,[params]],,body]) => mkLet(params.map(v => [v[0], v[2]]), mkDo(body.map(v => v[0])))
%}

#################################

lit -> list[(expr _):+] {% ([[,,vals]]) => mkList(vals[0][0][0], vals[0].slice(1).map(v => v[0])) %}
     | vector[(expr _):*] {% ([[,,vals]]) => mkVector(vals.map(v => v[0][0])) %}
     | map[(mapIdentifier _ expr _):*] {% id %}
     | quoted {% id %}
     | optional {% id %}
     | number {% id %}
     | string {% id %}
     | symbol {% id %}
     | keyword {% id %}
     | bool {% id %}
     | unit {% id %}

mapIdentifier -> string {% id %}
               | keyword {% id %}

unit -> %lparen _ %rparen {% () => mkUnit() %}

optional -> %nilLit {% () => mkOptional() %}
          | %some expr {% ([val]) => mkOptional(val) %}
quoted -> %quote expr {% ([, l]) => mkQuoted(l) %}

bool -> %trueLit {% () => mkBool(true) %}
      | %falseLit {% () => mkBool(false) %}

number -> %number {% ([num]) => mkNumber(num.value) %}
string -> %string {% ([str]) => mkString(str.value) %}

symbol -> %symbol {% ([sym]) => mkSymbol(sym.value) %}
        | %defSym {% ([sym]) => mkSymbol(sym.value) %}
        | %fnSym {% ([sym]) => mkSymbol(sym.value) %}
        | %defnSym {% ([sym]) => mkSymbol(sym.value) %}
        | %caseSym {% ([sym]) => mkSymbol(sym.value) %}
        | %condSym {% ([sym]) => mkSymbol(sym.value) %}
        | %doSym {% ([sym]) => mkSymbol(sym.value) %}
        | %dotimesSym {% ([sym]) => mkSymbol(sym.value) %}

keyword -> %keyword {% ([kw]) => mkKeyword(kw.value) %}

_ -> %ws:* {% function() { return null } %}
