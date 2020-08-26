#!/usr/bin/env bash
declare DIR="$(cd "$(dirname "$0")/../src" && pwd -P)"

if ! type nearleyc &> /dev/null; then
  echo 'No nearleyc executable found in $PATH'
  exit
fi

nearleyc "$DIR/template/parser/grammar.ne" > "$DIR/template/parser/grammar.ts"
nearleyc "$DIR/tagSelector/grammar.ne" > "$DIR/tagSelector/grammar.ts"
