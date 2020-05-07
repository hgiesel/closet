@{%
import tokenizer from './tokenizer'
import initTagKeeper from './tagKeeper'

import {
    ARG_SEP,
} from '../../templateTypes.ts'

const tagKeeper = initTagKeeper()
%}

@preprocessor typescript
@lexer tokenizer

#################################

start -> content %EOF {% () => tagKeeper.stop().value %}

content -> _ (tag _):*

tag -> tagstart inner %tagend {% ([,tag,]) => [[
    TAG_START,
    tag.join(ARG_SEP),
    TAG_END,
], tagKeeper.endToken(endToken.offset, tag)] %}

tagstart -> %tagstart {% ([startToken]) => [startToken.value, tagKeeper.startToken(startToken.offset + startToken.value.length)] %}

inner -> %keyname (%sep _values (tag _values):* ):? {% ([key,rest]) => rest
    ? [key.value, rest[1] + rest[2].map(([tag, vtxt]) => id(tag).join('') + vtxt)]
    : [key.value],
%}

_values -> %valuestext:* {% ([vs]) => vs.map(v => v.value).join('') %}
_ -> %text:* {% () => null %}
