#!/usr/bin/env bash
declare DIR="$(cd "$(dirname "$0")/.." && pwd -P)"
declare addon_id='ClosetForAnki'

cd "$DIR/anki"

declare debug_target="./src/utils.py"

# turn off DEBUG mode
sed -i.bak -e "s#DEBUG = True#DEBUG = False#" "$debug_target"

zip -r "$DIR/build/$addon_id.ankiaddon" \
  *".py" \
  "manifest.json" \
  "gui/"*".py" \
  "gui/forms/"*".py" \
  "icons/"*".png" \
  "src/"*".py" \
  "src/editor/"*".py" \
  "src/webview/"*".py" \
  "web/"*

# turn on DEBUG mode
sed -i.bak -e "s#DEBUG = False#DEBUG = True#" "$debug_target"
rm "$debug_target.bak"
