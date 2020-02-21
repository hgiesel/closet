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

    mkProg,
} from '../constructors'

import tokenizer from './tokenizer'
%}

@preprocessor typescript
@lexer tokenizer

prog -> stmts {% ([stmts]) => mkProg(stmts) %}

trailingWs[X] -> $X _ {% id %}

stmts -> _ (trailingWs[lit]):* {% ([_, stmts]) => stmts %}

lit -> list
     | vector
     | map
     | quoted
     | optional
     | number
     | string
     | symbol
     | keyword
     | bool

mapIdentifier -> string
               | keyword

list -> %lparen _ trailingWs[lit]:+ %rparen
unit -> %lparen _ %rparen {% () => mkUnit() %}

vector -> %lbracket _ trailingWs[lit]:* %rbracket
map -> %lbrace _ (trailingWs[mapIdentifier] trailingWs[lit]):* %rbrace

optional -> %nil {% () => mkOptional() %}
          | %some lit

quoted -> %quote lit {% ([_, l]) => mkQuoted(l) %}

bool -> %trueLit {% () => mkBool(true) %}
      | %falseLit {% () => mkBool(false) %}

number -> %number {% ([num]) => mkNumber(num) %}
string -> %string {% ([str]) => mkString(str) %}
symbol -> %symbol {% id %}
keyword -> %keyword {% id %}

_ -> %ws:? {% function() { return null } %}
