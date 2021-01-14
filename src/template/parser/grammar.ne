@{%
import { TextNode } from '../nodes'

import { tagBuilder } from './tagBuilder'
%}

@preprocessor typescript
@lexer tokenizer

#################################

start -> content {% id %}

content -> node:* {% id %}
node -> text {% id %}
      | tag {% id %}

text -> %text {% ([match]) => new TextNode(match.value) %}

tag -> %tagopen %keyname inner %tagclose {% ([,name,[nodes,abbrev]]) => tagBuilder.build(
    name.value,
    nodes,
    abbrev,
)
%}

inner -> (%sep content):? {% ([match]) => match
    ? [match[1], false]
    : [[], true]
%}
