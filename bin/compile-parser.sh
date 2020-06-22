#!/usr/bin/env bash
declare DIR="$(cd "$(dirname "$0")/../src/template/parser" && pwd -P)"

if ! type nearleyc &> /dev/null; then
  echo 'No nearleyc executable found in $PATH'
  exit
fi

declare from="$DIR/template.ne"
declare to="$DIR/template.ts"

nearleyc "$from" > "$to"
