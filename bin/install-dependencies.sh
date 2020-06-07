#!/usr/bin/env bash
declare DIR="$(cd "$(dirname "$0")/.." && pwd -P)"

if [[ "$(uname)" == 'Darwin' ]]; then
  brew install imagemagick

elif [[ "$(uname)" == 'Linux' ]]; then
  : # nothing yet

else
  echo 'Unknown plattform'
  exit 5
fi
