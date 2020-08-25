@{%
import tagSelectorTokenizer from './tokenizer'
%}

@preprocessor typescript
@lexer tagSelectorTokenizer

#################################

start -> key num occur

key -> (keyComps):+

keyComps -> mixedText
          | %escapeseq
          | keyGroup

mixedText -> %text
           | %digits
           | %star

keyGroup -> %groupOpen keyGroupInner %groupClose

keyGroupInner -> keyGroupItem (%groupAlternative keyGroupItem):*

keyGroupItem -> (mixedText):*

#################################

num -> %digits
     | %star
     | numGroup

numGroup -> %groupOpen numGroupInner %groupClose

numGroupInner -> (numGroupItem):? (%groupAlternative (numGroupItem):?):*

numGroupItem -> %digits
              | range
              | multiple

range -> bounded
       | leftBounded
       | rightBounded

bounded -> %digits %rangeSpecifier %digits

leftBounded -> %digits %rangeSpecifier

rightBounded -> %rangeSpecifier %digits

multiple -> %digits %multiplierSeq %digits

#################################

occur -> %digits
       | %star
       | occurGroup

occurGroup -> %groupOpen occurGroupInner %groupClose

occurGroupInner -> numGroupItem (%groupAlternative numGroupItem):*
