#!/usr/bin/env bash
declare DIR="$(cd "$(dirname "$0")/../anki" && pwd -P)"
declare addon_name="ClosetDev"
declare customdir=''

if [[ "$1" =~ ^-?d$ ]]; then
  if [[ -d "$customdir" ]]; then
    rm "$customdir/$addon_name"

  elif [[ -d "$HOME/.local/share/AnkiDev/addons21" ]]; then
    rm "$HOME/.local/share/AnkiDev/addons21/$addon_name"

  elif [[ $(uname) = 'Darwin' ]]; then
    rm "$HOME/Library/Application Support/Anki2/addons21/$addon_name"

  elif [[ $(uname) = 'Linux' ]]; then
    rm "$HOME/.local/share/Anki2/addons21/$addon_name"

  else
    echo 'Unknown platform'
    exit -1
  fi

elif [[ "$1" =~ ^-?c$ ]]; then
  if [[ -d "$customdir" ]]; then
    ln -s "$DIR" "$customdir/$addon_name"

  elif [[ -d "$HOME/.local/share/AnkiDev/addons21" ]]; then
    ln -s "$DIR" "$HOME/.local/share/AnkiDev/addons21/$addon_name"

  elif [[ $(uname) = 'Darwin' ]]; then
    ln -s "$DIR" "$HOME/Library/Application\ Support/Anki2/addons21/$addon_name"

  elif [[ $(uname) = 'Linux' ]]; then
    ln -s "$DIR" "$HOME/.local/share/Anki2/addons21/$addon_name"

  else
    echo 'Unknown platform'
    exit -1
  fi

else
  echo 'Unknown command'
  exit -2
fi
