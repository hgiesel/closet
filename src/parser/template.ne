@{%
import tokenizer from './tokenizer'
import TagKeeper from './tagKeeper'

import {
    TAG_START,
    TAG_END,
    ARG_SEP,
} from '../utils'

export const tagKeeper = new TagKeeper()
%}

@preprocessor typescript
@lexer tokenizer

#################################

start -> content %EOF {% () => tagKeeper %}

content -> _ (tag _):*

tag -> tagstart inner %tagend {% ([,[keyname, valuesRaw],tagend]) => [[
    TAG_START,
    `${keyname}${ARG_SEP}${valuesRaw}`,
    TAG_END,
], tagKeeper.endToken(tagend.offset + TAG_END.length, keyname, valuesRaw)] %}

tagstart -> %tagstart {% ([startToken]) => [startToken.value, tagKeeper.startToken(startToken.offset + startToken.value.length - TAG_START.length)] %}

inner -> %keyname (%sep _values (tag _values):* ):? {% ([key,rest]) => rest
    ? [key.value, rest[1] + rest[2].map(([tag, vtxt]) => id(tag).join('') + vtxt)]
    : [key.value],
%}

_values -> %valuestext:* {% ([vs]) => vs.map(v => v.value).join('') %}
_ -> %text:* {% () => null %}
