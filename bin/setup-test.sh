#!/usr/bin/env bash
declare DIR="$(cd "$(dirname "$0")/../test/browser/dist" && pwd -P)"

if [[ -f "$DIR/_virtual/_tslib" ]]; then
  mv -f "$DIR/_virtual/_tslib" "$DIR/_virtual/_tslib.js"
fi

for file in "$DIR/"*'.js'; do
  sed -i 's@tslib@./_virtual/_tslib.js@g' "$file"
done

for file in "$DIR/"*/*'.js'; do
  sed -i 's@tslib@../_virtual/_tslib.js@g' "$file"
done

for file in "$DIR/"*/*/*'.js'; do
  sed -i 's@tslib@../../_virtual/_tslib.js@g' "$file"
done

for file in "$DIR/"*/*/*/*'.js'; do
  sed -i 's@tslib@../../../_virtual/_tslib.js@g' "$file"
done
