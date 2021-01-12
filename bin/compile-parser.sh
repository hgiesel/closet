#!/usr/bin/env bash
DIR="$(cd "$(dirname "$0")/../src" && pwd -P)"

if ! type nearleyc &> /dev/null; then
  echo 'No nearleyc executable found in $PATH'
  exit
fi

################ TEMPLATE

template="$DIR/template/parser/grammar"
template_source="${template}.ne"
template_target="${template}.ts"

nearleyc "$template_source" > "$template_target"

################ TEMPLATE ADAPTIONS

remove_import="import { templateTokenizer } from './tokenizer'"

sed -i.bak -e "s#$remove_import##" "$template_target"

open_grammar='const grammar: Grammar = {'
new_open_grammar='const makeGrammar = (tokenizer: NearleyLexer): Grammar => {'

sed -i.bak -e "s/$open_grammar/$new_open_grammar\n$open_grammar/" "$template_target"

close_grammar='ParserStart: "start",'
new_close_grammar='return grammar'

sed -i.bak -e "s/$close_grammar/$close_grammar\n};\n$new_close_grammar/" "$template_target"

old_export='export default grammar;'
new_export='export default makeGrammar;'

sed -i.bak -e "s/$old_export/$new_export/" "$template_target"

old_lexer='interface NearleyLexer {'
export_lexer='export interface NearleyLexer {'

sed -i.bak -e "s/$old_lexer/$export_lexer/" "$template_target"

################ TAG SELECTOR

tagSelector="$DIR/template/tagSelector/grammar"
tagSelector_source="${tagSelector}.ne"
tagSelector_target="${tagSelector}.ts"

nearleyc "$tagSelector_source" > "$tagSelector_target"

################ TAG SELECTOR ADAPTIONS

type_invalid_lexer='Lexer: tagSelectorTokenizer,'
type_forced_lexer='Lexer: tagSelectorTokenizer as unknown as NearleyLexer,'

sed -i.bak -e "s/$type_invalid_lexer/$type_forced_lexer/" "$tagSelector_target"

################ CLEANUP

rm -f "$template_target.bak"
rm -f "$tagSelector_target.bak"
