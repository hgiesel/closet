#!/usr/bin/env bash
declare DIR="$(cd "$(dirname "$0")/.." && pwd -P)"

if [[ ! -h "$DIR/dist/node_modules/mocha" ]]; then
  ln -s "$DIR/node_modules/mocha" "$DIR/dist/node_modules/mocha"
else
  echo "Mocha was already linked."
fi
