#!/usr/bin/env bash
declare DIR="$(cd "$(dirname "$0")/../src" && pwd -P)"

if ! type nearleyc &> /dev/null; then
  echo 'No nearleyc executable found in $PATH'
  exit
fi

################ TEMPLATE

declare template="$DIR/template/parser/grammar"
declare template_source="${template}.ne"
declare template_target="${template}.ts"

nearleyc "$template_source" > "$template_target"

################ TEMPLATE ADAPTIONS

declare remove_import="import { templateTokenizer } from './tokenizer'"

sed -i.bak -e "s#$remove_import##" "$template_target"

declare open_grammar='const grammar: Grammar = {'
declare new_open_grammar='const makeGrammar = (tokenizer: NearleyLexer): Grammar => {'

sed -i.bak -e "s/$open_grammar/$new_open_grammar\n$open_grammar/" "$template_target"

declare close_grammar='ParserStart: "start",'
declare new_close_grammar='return grammar'

sed -i.bak -e "s/$close_grammar/$close_grammar\n};\n$new_close_grammar/" "$template_target"

declare old_export='export default grammar;'
declare new_export='export default makeGrammar;'

sed -i.bak -e "s/$old_export/$new_export/" "$template_target"

declare old_lexer='interface NearleyLexer {'
declare export_lexer='export interface NearleyLexer {'

sed -i.bak -e "s/$old_lexer/$export_lexer/" "$template_target"

################ TAG SELECTOR

declare tagSelector="$DIR/tagSelector/grammar"
declare tagSelector_source="${tagSelector}.ne"
declare tagSelector_target="${tagSelector}.ts"

nearleyc "$tagSelector_source" > "$tagSelector_target"

################ TAG SELECTOR ADAPTIONS

declare type_invalid_lexer='Lexer: tagSelectorTokenizer,'
declare type_forced_lexer='Lexer: tagSelectorTokenizer as unknown as NearleyLexer,'

sed -i.bak -e "s/$type_invalid_lexer/$type_forced_lexer/" "$tagSelector_target"

################ CLEANUP

rm -f "$template_target.bak"
rm -f "$tagSelector_target.bak"
