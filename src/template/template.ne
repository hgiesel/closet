@{%
import tokenizer from './tokenizer'
import setKeeper from './setKeeper'

const sk = setKeeper()
sk.next()
%}

@preprocessor typescript
@lexer tokenizer

#################################

start -> content %EOF {% () => sk.next('stop').value %}

content -> _ (set _):*

set -> setstart inner %setend {% ([starttoken,theSet,endtoken]) => [
    [
    starttoken[0] /* '[[' */,
    theSet,
    endtoken.value /* ']]' */
    ],
sk.next([-endtoken.offset, theSet])] %}

setstart -> %setstart {% ([starttoken]) => [starttoken.value, sk.next([starttoken.offset])] %}

inner -> head (%argsep args):* {% ([head,args]) => [head, ...args.map(v => v[1])] %}

head -> %intext:+ {% ([vs]) => vs.map(v => v.value).join('') %}
args -> val (%altsep val):* {% ([first, rest]) => [first, ...rest.map(v => v[1])] %}

val -> _in (set _in):*  {%
    ([first,rest]) => (console.log('foo', first, rest), rest.reduce((accu, v) => [accu, [v[0][0][0], [v[0][0][1][0], v[0][0][1].slice(1).flat().join('||')].join('::'), v[0][0][2]].join(''), v[1]].join(''), first))
%}

_in -> %intext:* {% ([vs]) => vs.map(v => v.value).join('') %}
_ -> %text:* {% () => null %}

### FOR DEBUG
# @{%
# let a = 0
# %}
#
# start -> content [$] {% (v) => (a++, [v, a]) %}
#
# content -> _ (set _):*
#
# set -> setstart inner "]]"
# setstart -> "[["
#
# inner -> head ("::" args):*
#
# head -> "h":+
# args -> val ("||" val):*
#
# val -> _in (set _in):*
#
# _in -> "i":*
# _ -> "o":*
