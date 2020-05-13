#!/usr/bin/env bash
declare DIR="$(realpath "${BASH_SOURCE%/*}")"

if ! type nearleyc &> /dev/null; then
  echo 'No nearleyc executable found in $PATH'
  exit
fi

from="$DIR/../src/parser/template.ne"
to="$DIR/../src/parser/template.ts"

nearleyc "$from" > "$to"
