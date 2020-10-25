#!/usr/bin/env bash
declare DIR="$(cd "$(dirname "$0")/../src" && pwd -P)"

if ! type nearleyc &> /dev/null; then
  echo 'No nearleyc executable found in $PATH'
  exit
fi

################ TEMPLATE

declare template_source="$DIR/template/parser/grammar.ne"
declare template_target="$DIR/template/parser/grammar.ts"

nearleyc "$template_source" > "$template_target"

################ TEMPLATE ADAPTIONS

declare remove_import="import { templateTokenizer } from './tokenizer'"

sed -i "s#$remove_import##" "$template_target"

declare open_grammar='const grammar: Grammar = {'
declare new_open_grammar='const getGrammar = (tokenizer: NearleyLexer) => {'

sed -i "s/$open_grammar/$new_open_grammar\n$open_grammar/" "$template_target"

declare close_grammar='ParserStart: "start",'
declare new_close_grammar='return grammar'

sed -i "s/$close_grammar/$close_grammar\n};\n$new_close_grammar/" "$template_target"

declare old_export='export default grammar;'
declare new_export='export default getGrammar;'

sed -i "s/$old_export/$new_export/" "$template_target"

################ TAG SELECTOR

declare tagSelector_source="$DIR/tagSelector/grammar.ne" 
declare tagSelector_target="$DIR/tagSelector/grammar.ts"

nearleyc "$tagSelector_source" > "$tagSelector_target"
