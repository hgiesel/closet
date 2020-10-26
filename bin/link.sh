#!/usr/bin/env bash
DIR="$(cd "$(dirname "$0")/../anki" && pwd -P)"
addon_name="ClosetForAnkiDev"
customdir=''

if [[ -d "$customdir" ]]; then
  target="$customdir/$addon_name"

elif [[ -d "$HOME/.local/share/AnkiDev/addons21" ]]; then
  target="$HOME/.local/share/AnkiDev/addons21/$addon_name"

elif [[ $(uname) = 'Darwin' ]]; then
  target="$HOME/Library/Application Support/Anki2/addons21/$addon_name"

elif [[ $(uname) = 'Linux' ]]; then
  target="$HOME/.local/share/Anki2/addons21/$addon_name"

else
  echo 'Unknown platform'
  exit -1
fi

if [[ "$1" =~ ^-?d$ ]]; then
  if [[ ! -h "$target" ]]; then
    echo 'Directory was not linked'
  else
    rm "$target"
  fi

elif [[ "$1" =~ ^-?c$ ]]; then
  if [[ ! -h "$target" ]]; then
    ln -s "$DIR" "$target"
  else
    echo 'Directory was already linked.'
  fi

else
  echo 'Unknown command'
  exit -2
fi
