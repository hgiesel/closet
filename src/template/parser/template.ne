@{%
import { tokenizer } from './tokenizer'
import { TagBuilder } from './tagBuilder'

export const tagBuilder = new TagBuilder()
%}

@preprocessor typescript
@lexer tokenizer

#################################

start -> content {% id %}

content -> node:* {% id %}
node -> text {% id %}
      | tag {% id %}

text -> %text {% ([match]) => ({
    type: 'text',
    value: match.value,
})
%}

tag -> %tagopen %keyname inner %tagclose {% ([,name,nodes]) => tagBuilder.build(
    name.value,
    nodes,
)
%}

inner -> (%sep content):? {% ([match]) => match ? match[1] : [] %}
