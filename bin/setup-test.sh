#!/usr/bin/env bash
declare DIR="$(cd "$(dirname "$0")/../test/browser/dist" && pwd -P)"

if [[ -f "$DIR/_virtual/_tslib" ]]; then
  mv -f "$DIR/_virtual/_tslib" "$DIR/_virtual/_tslib.js"
fi

for file in "$DIR/"*'.js'; do
  sed -i.bak -e 's@tslib@tslib.js@g' -- "$file" && rm -- "$file.bak"
done

for file in "$DIR/"*/*'.js'; do
  sed -i.bak -e 's@tslib@tslib.js@g' -- "$file" && rm -- "$file.bak"
done

for file in "$DIR/"*/*/*'.js'; do
  sed -i.bak -e 's@tslib@tslib.js@g' -- "$file" && rm -- "$file.bak"
done

for file in "$DIR/"*/*/*/*'.js'; do
  sed -i.bak -e 's@tslib@tslib.js@g' -- "$file" && rm -- "$file.bak"
done
