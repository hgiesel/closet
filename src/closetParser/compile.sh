#!/usr/bin/env bash

if ! type nearleyc &> /dev/null; then
  echo 'No nearleyc executable found in $PATH'
  exit
fi

from='./slang.ne'
to='slang.ts'

rm -f $filename
nearleyc "$from" > "$to"
