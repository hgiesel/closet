#!/usr/bin/env bash
declare DIR="$(cd "$(dirname "$0")/.." && pwd -P)"

convert "$DIR/images/logo.png" -define icon:auto-resize=64,48,32,16 "$DIR/docs/favicon.ico"

# copy logo to image folder"
cp -f "$DIR/images/weblogo.png" "$DIR/docs/assets/images"
cp -f "$DIR/images/logo.png" "$DIR/docs/assets/images"
