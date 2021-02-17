@{%
import { TextNode, EscapedNode } from '../nodes'

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
      | %escapeseq {% ([match]) => new EscapedNode(match.value) %}

inlinetag -> %inlineopen inline {%
    ([/* open */, [name, inlineNodes, hasInline]]) => tagBuilder.build(
        name.value,
        inlineNodes,
        hasInline,
    )
%}

blocktag -> %blockopen inline content blockclose {%
    ([/* open */, [name, inlineNodes, hasInline], blockNodes, closename], _location, reject) =>
        !closename || name.value === closename.value
            ? tagBuilder.build(
                name.value,
                inlineNodes,
                hasInline,
                blockNodes,
                true,
            )
            : reject
%}

inline -> %keyname (%sep content):? %close {% ([name, match]) => match
    ? [name, match[1], true]
    : [name, [], false]
%}

blockclose -> %blockclose %keyname:? %close {% ([,name]) => name %}
