#!/usr/bin/env bash
declare DIR="$(cd "$(dirname "$0")/.." && pwd -P)"
declare addon_id='ClosetForAnki'

cd "$DIR"

npm run build-anki

cd "$DIR/anki"

zip -r "$DIR/build/$addon_id.ankiaddon" \
  ""*".py" \
  "manifest.json" \
  "src/"* \
  "web/"* \
  "icons/"*
