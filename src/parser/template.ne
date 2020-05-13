@{%
import {
    TagInfo,
} from '../tags'

import tokenizer from './tokenizer'
import TagMaker from './tagMaker'

import {
    TAG_START,
    TAG_END,
    ARG_SEP,
} from '../utils'
%}

@preprocessor typescript
@lexer tokenizer

#################################

start -> content %EOF {% ([c,eof]) => console.log(c, eof.offset - 1) %}

content -> _ (tag _):* {% ([,tags]) => tags.map(id) %}

tag -> tagstart inner %tagend {% ([startTokenIdx,[keyname, valuesRaw],tagend]) => [[
    TAG_START,
    `${keyname}${ARG_SEP}${valuesRaw}`,
    TAG_END,
], [startTokenIdx, tagend.offset + TAG_END.length, keyname, valuesRaw]] %}

tagstart -> %tagstart {% ([startToken]) => startToken.offset + startToken.value.length - TAG_START.length %}

inner -> %keyname (%sep _values (tag _values):* ):? {% ([key,rest]) => rest
    ? [key.value, rest[1] + rest[2].map(([tag, vtxt]) => id(tag).join('') + vtxt)]
    : [key.value],
%}

_values -> %valuestext:* {% ([vs]) => vs.map(v => v.value).join('') %}
_ -> %text:* {% () => null %}
