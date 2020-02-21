@{%
import tokenizer from './tokenizer'
%}

@preprocessor typescript
@lexer tokenizer

#################################

start -> content

content -> __ (%setstart alts %setend __):*

alts -> values (%altsep values):*

values -> val (%valuesep val):* {% (val) => console.log('fo', val) %}

val -> %intext:? {% id %}
__ -> %text:? {% () => null %}
