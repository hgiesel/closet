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

    mkDef,
    mkDo,
    mkLet,

    mkIf,
    mkCond,
    mkCase,

    mkFor,
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

prog -> exprs {% ([exprs]) => mkDo(exprs) %}

exprs -> _ (expr _):* {% ([,exprs]) => exprs.map(id) %}

expr -> stmt {% id %}
      | lit {% id %}

stmt -> def {% id %}
      | fn {% id %}
      | defn {% id %}
      | do {% id %}
      | let {% id %}
      | if {% id %}
      | case {% id %}
      | cond {% id %}
      | for {% id %}

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

if -> %lparen _ %ifSym _ expr _ expr _ (expr _):? %rparen {%
    ([,,,,pred,,thenClause,,maybeElseClause]) => mkIf(
        pred,
        thenClause,
        maybeElseClause
            ? maybeElseClause[0]
            : mkUnit(),
    )
%}

cond -> %lparen _ %condSym _ (expr _ expr _):* %rparen {%
    ([,,,,vals]) => mkCond(vals.map(v => [v[0], v[2]]))
%}

case -> %lparen _ %caseSym _ symbol _ (expr _ expr _):* %rparen {%
    ([,,,,sym,,vals]) => mkCase(sym, vals.map(v => [v[0], v[2]]))
%}

for -> %lparen _ %forSym _ vector[(symbol _ expr _):*] _ expr _ %rparen {%
    ([,,,,[,,[params]],,body]) => mkFor(params.map(v => [v[0], v[2]]), body)
%}

#################################

lit -> list[(expr _):+] {% ([[,,[vals]]]) => mkList(vals[0][0], vals.slice(1).map(id)) %}
     | vector[(expr _):*] {% ([[,,[vals]]]) => mkVector(vals.map(id)) %}
     | map[(mapIdentifier _ expr _):*] {% ([[,,[vals]]]) => mkMap(vals.map(v => [v[0], v[2]])) %}
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
keyword -> %keyword {% ([kw]) => mkKeyword(kw.value) %}

_ -> %ws:* {% function() { return null } %}
