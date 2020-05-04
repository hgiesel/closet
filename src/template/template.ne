@{%
import tokenizer from './tokenizer'
import tagKeeper from './tagKeeper'

const tk = tagKeeper()
tk.next()
%}

@preprocessor typescript
@lexer tokenizer

#################################

start -> content %EOF {% () => tk.next('stop').value %}

content -> _ (tag _):*

tag -> tagstart inner %tagend {% ([startToken,tag,endToken]) => [
    [
    startToken[0] /* '[[' */,
    tag,
    endToken.value /* ']]' */
    ],
tk.next([-endToken.offset, tag])] %}

tagstart -> %tagstart {% ([startToken]) => [startToken.value, tk.next([startToken.offset])] %}

inner -> key (%argsep args):* {% ([key,args]) => [key, ...args.map(v => v[1])] %}

key -> %intext:+ {% ([vs]) => vs.map(v => v.value).join('') %}
args -> val (%altsep val):* {% ([first, rest]) => [first, ...rest.map(v => v[1])] %}

val -> _in (tag _in):*  {%
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
# content -> _ (tag _):*
#
# tag -> tagstart inner "]]"
# tagstart -> "[["
#
# inner -> key ("::" args):*
#
# key -> "h":+
# args -> val ("||" val):*
#
# val -> _in (tag _in):*
#
# _in -> "i":*
# _ -> "o":*
