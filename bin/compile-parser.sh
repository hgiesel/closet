#!/usr/bin/env bash
declare DIR="$(cd "$(dirname "$0")/../src/template/parser" && pwd -P)"

if ! type nearleyc &> /dev/null; then
  echo 'No nearleyc executable found in $PATH'
  exit
fi

nearleyc "$DIR/template.ne" > "$DIR/template.ts"
nearleyc "$DIR/tagSelector/grammar.ne" > "$DIR/tagSelector/grammar.ts"
