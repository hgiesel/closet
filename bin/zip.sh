#!/usr/bin/env bash
declare DIR="$(cd "$(dirname "$0")/.." && pwd -P)"

if [[ ! -f  "$DIR/anki/src/web/closet.js" ]]; then
  echo 'Refuse zipping. You need to build closet for anki first.'
  exit -5
fi

if [[ "$1" =~ ^-?a$ ]]; then
  # for uploading to AnkiWeb
  declare addon_id='0'
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
