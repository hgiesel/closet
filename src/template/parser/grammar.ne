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
      | inlinetag {% id %}
      | blocktag {% id %}

text -> %text {% ([match]) => new TextNode(match.value) %}

inlinetag -> %inlineopen %keyname inline %close {%
    ([,name,[nodes,abbrev]]) => tagBuilder.build(
        name.value,
        nodes,
        abbrev,
    )
%}

blocktag -> %blockopen %keyname inline %close content blockclose {%
    ([,name,[nodes,abbrev],,blockNodes,]) => tagBuilder.build(
        name.value,
        nodes,
        abbrev,
    )
%}

blockclose -> %blockclose %keyname:? %close {% ([,name]) => name %}

inline -> (%sep content):? {% ([match]) => match
    ? [match[1], false]
    : [[], true]
%}
