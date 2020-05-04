@{%
import tokenizer from './tokenizer'
import initTagKeeper from './tagKeeper'

const tagKeeper = initTagKeeper()
%}

@preprocessor typescript
@lexer tokenizer

#################################

start -> content %EOF {% () => tagKeeper.stop().value %}

content -> _ (tag _):*

tag -> tagstart inner %tagend {% ([startToken,tag,endToken]) => [[
    id(startToken) /* '[[' */,
    tag.join('::'),
    endToken.value /* ']]' */,
], tagKeeper.endToken(endToken.offset, tag)] %}

tagstart -> %tagstart {% ([startToken]) => [startToken.value, tagKeeper.startToken(startToken.offset + startToken.value.length)] %}

inner -> %keyname %sep _values (tag _values):* {% ([key,,first,rest]) => [
    key.value,
    first + rest.map(([tag, vtxt]) => id(tag).join('') + vtxt),
] %}

_values -> %valuestext:* {% ([vs]) => vs.map(v => v.value).join('') %}
_ -> %text:* {% () => null %}
