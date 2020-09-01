#!/usr/bin/env bash
declare DIR="$(cd "$(dirname "$0")/.." && pwd -P)"

if [[ "$(uname)" == 'Darwin' ]]; then
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"

  brew install imagemagick
  brew install pyqt5

elif [[ "$(uname)" == 'Linux' ]]; then
  : # nothing yet

else
  echo 'Unknown plattform'
  exit 5
fi
