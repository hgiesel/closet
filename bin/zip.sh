#!/usr/bin/env bash
declare DIR="$(cd "$(dirname "$0")/.." && pwd -P)"

if [[ "$1" =~ ^-?a$ ]]; then
  # for uploading to AnkiWeb
  declare addon_id='unknown'
else
  # for installing myself
  declare addon_id='anki_closet'
fi

cd "$DIR/anki"

zip -r "$DIR/$addon_id.ankiaddon" \
  ""*".py" \
  "manifest.json" \
  "src/"*".py" \
  "src/web/"*".js"
