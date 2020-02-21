@{%
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
%}

@preprocessor typescript
@lexer tokenizer

inParens[X]   -> %lparen   _ $X %rparen
inBrackets[X] -> %lbracket _ $X %rbracket
inBraces[X]   -> %lbrace   _ $X %rbrace

#################################

start -> prog {% id %}

prog -> _ (expr _):* {%
    ([,vals]) => mkDo(vals.map(id))
%}

expr -> lit {% id %}
      | shCutFn {% id %}

#################################

lit -> inParens[list] {% ([[,,[val]]]) => val %}
     | vector         {% id %}
     | map            {% id %}
     | quoted         {% id %}
     | optional       {% id %}
     | deref          {% id %}
     | number         {% id %}
     | string         {% id %}
     | regex          {% id %}
     | symbol         {% id %}
     | keyword        {% id %}
     | bool           {% id %}

vector -> inBrackets[(expr _):*] {%
    ([[,,[vals]]]) => mkVector(vals.map(id))
%}

map -> inBraces[(mapIdentifier _ expr _):*] {%
    ([[,,[vals]]]) => mkMap(vals.map(v => [v[0], v[2]]))
%}

mapIdentifier -> string  {% id %}
               | keyword {% id %}
               | number  {% id %}

optional -> %nilLit   {% () => mkOptional(null) %}
          | %amp expr {% ([,val]) => mkOptional(val) %}

quoted -> %quote expr {% ([,quot]) => mkQuoted(quot) %}

deref -> %at expr {% ([,expr]) => mkList(mkSymbol('deref'), [expr]) %}

bool    -> %trueLit  {% () => mkBool(true) %}
         | %falseLit {% () => mkBool(false) %}

number  -> %number    {% ([num]) => mkNumber(num.value) %}
         | %infLit    {% ([num]) => mkNumber(Infinity) %}
         | %negInfLit {% ([num]) => mkNumber(-Infinity) %}
         | %nanLit    {% ([num]) => mkNumber(NaN) %}
 
string  -> %string   {% ([str]) => mkString(str.value) %}

symbol  -> %symbol   {% ([sym]) => mkSymbol(sym.value) %}
keyword -> %keyword  {% ([kw]) => mkKeyword(kw.value) %}

regex -> %regex  {% ([re]) => mkRegex(re.value) %}

#################################

list -> def         {% id %}
      | fn          {% id %}
      | defn        {% id %}
      | do          {% id %}
      | let         {% id %}
      | if          {% id %}
      | case        {% id %}
      | cond        {% id %}
      | for         {% id %}
      | doseq       {% id %}
      | threadfirst {% id %}
      | threadlast  {% id %}
      | op          {% id %}
      | unit        {% id %}

def -> %defSym _ symbol _ expr _ {%
    ([,,ident,,val]) => mkDef(ident, val)
%}

fn -> %fnSym _ inBrackets[(symbol _):*] _ expr _ {%
    ([,,[,,params],,body]) => mkFunction(`fn_${Math.floor(Math.random() * 2e6)}`, params[0].map(id), body)
%}

defn -> %defnSym _ symbol _ inBrackets[(symbol _):*] _ expr _ {%
    ([,,ident,,[,,params],,body]) => mkDef(ident, mkFunction(ident, params[0].map(id), body))
%}

do -> %doSym _ (expr _):* {%
    ([,,vals]) => mkDo(vals.map(id))
%}

let -> %letSym _ inBrackets[(symbol _ expr _):*] _ (expr _):* {%
    ([,,[,,[params]],,body]) => mkLet(params.map(v => [v[0], v[2]]), mkDo(body.map(v => v[0])))
%}

if -> %ifSym _ expr _ expr _ (expr _):? {%
    ([,,pred,,thenClause,,maybeElseClause]) => mkIf(
        pred,
        thenClause,
        maybeElseClause
            ? maybeElseClause[0]
            : mkUnit(),
    )
%}

cond -> %condSym _ (expr _ expr _):* {%
    ([,,vals]) => mkCond(vals.map(v => [v[0], v[2]]))
%}

case -> %caseSym _ symbol _ (expr _ expr _):* {%
    ([,,sym,,vals]) => mkCase(sym, vals.map(v => [v[0], v[2]]))
%}

for -> %forSym _ inBrackets[(symbol _ expr _):*] _ expr _ {%
    ([,,[,,[params]],,body]) => mkFor(params.map(v => [v[0], v[2]]), body)
%}

doseq -> %doseqSym _ inBrackets[(symbol _ expr _):*] _ expr _ {%
    ([,,[,,[params]],,body]) => mkDoseq(params.map(v => [v[0], v[2]]), body)
%}

threadfirst -> %arrowSym _ expr _ (expr _):* {%
    ([,,val,,pipes]) => mkThreadFirst(val, pipes.map(id))
%}

threadlast -> %darrowSym _ expr _ (expr _):* {%
    ([,,val,,pipes]) => mkThreadLast(val, pipes.map(id))
%}

op -> (expr _):+ {%
    ([vals]) => mkList(id(id(vals)), vals.slice(1).map(id))
%}

unit -> _ {%
    () => mkUnit()
%}

#################################

shCutFn -> %hashParen _ (lit _):+ %rparen {%
    ([,,vals]) => {
        const lst = mkList(vals[0][0], vals.slice(1).map(id))
        return mkShcutFunction(`fn_${Math.floor(Math.random() * 2e6)}`, shcutFuncArity(lst), lst)
    }
%}

_ -> %ws:* {% () => null %}

__ -> %ws:+ {% () => null %}
