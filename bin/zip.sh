#!/usr/bin/env bash
# declare DIR="$(realpath "${BASH_SOURCE%/*}")"
declare DIR="$(cd "$(dirname "$0")/../anki" && pwd -P)"

if [[ "$1" =~ ^-?a$ ]]; then
  # for uploading to AnkiWeb
  declare addon_id='unknown'
else
  # for installing myself
  declare addon_id='anki_closet'
fi

rm -f "${DIR}/${addon_id}.ankiaddon"

zip -r "${DIR}/${addon_id}.ankiaddon" \
  "${DIR}/config."{json,md} \
  "${DIR}/__init__.py" \
