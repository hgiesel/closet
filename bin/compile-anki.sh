DIR="$(cd "$(dirname "$0")/../anki" && pwd -P)"

for filename in "$DIR/designer/"*'.ui'; do
  pyuic6 "$filename" > "$DIR/gui/forms/$(basename ${filename%.*})_ui.py"
done

echo 'Was successfully compiled!'
