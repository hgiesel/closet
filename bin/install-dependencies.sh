#!/usr/bin/env bash
declare DIR="$(cd "$(dirname "$0")/.." && pwd -P)"

if [[ "$(uname)" == 'Darwin' ]]; then
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
  brew install imagemagick pyqt5

elif [[ "$(uname)" == 'Linux' ]]; then
  # Ubuntu
  sudo apt-get install qtcreator pyqt5-dev-tools

else
  echo 'Unknown plattform'
  exit 5
fi
