@{%
import { tagSelectorTokenizer } from './tokenizer'
%}

@preprocessor typescript
@lexer tagSelectorTokenizer

#################################

start -> " " {% id %}
