@{%
import tokenizer from './tokenizer'
import setKeeper from './setkeeper'
%}

@preprocessor typescript
@lexer tokenizer

#################################

start -> content {% id %}

content -> _ (set _):* {% ([,sets]) => sets.map(id) %}

set -> %setstart inner %setend {% ([,inner]) => inner %}

inner -> head (%argsep args):* {% ([head,args]) => [head, ...args.map(v => v[1])] %}

head -> %intext:+ {% ([vs]) => vs.map(v => v.value).join('') %}
args -> val (%altsep val):* {% ([first, rest]) => [first, ...rest.map(v => v[1])] %}

val -> _in (set _in):*  {%
    ([first,rest]) => rest.reduce((accu, v) => [accu, '[[', [v[0][0], v[0].slice(1).flat().join('||')].join('::'), ']]', v[1]].join(''), first)
%}

_in -> %intext:* {% ([vs]) => vs.map(v => v.value).join('') %}
_ -> %text:* {% () => null %}
