#!/usr/bin/env bash

if ! type nearleyc &> /dev/null; then
  echo 'No nearleyc executable found in $PATH'
  exit
fi

filename='slang.ts'

rm -f $filename
nearleyc ./slang.ne > $filename
