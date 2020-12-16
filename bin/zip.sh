#!/usr/bin/env bash
declare DIR="$(cd "$(dirname "$0")/.." && pwd -P)"
declare addon_id='ClosetForAnki'

cd "$DIR/anki"

zip -r "$DIR/build/$addon_id.ankiaddon" \
  *".py" \
  "manifest.json" \
  "gui/"*".py" \
  "gui/forms/"*".py" \
  "icons/"*".png" \
  "src/"*".py" \
  "src/editor/"*".py" \
  "web/"*
