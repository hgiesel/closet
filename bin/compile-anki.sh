DIR="$(cd "$(dirname "$0")/../anki" && pwd -P)"

mkdir -p "$DIR/gui/forms/qt5" "$DIR/gui/forms/qt6"

for filename in "$DIR/designer/"*'.ui'; do
  pyuic5 "$filename" > "$DIR/gui/forms/qt5/$(basename ${filename%.*})_ui.py"
  pyuic6 "$filename" > "$DIR/gui/forms/qt6/$(basename ${filename%.*})_ui.py"
done

echo 'Was successfully compiled!'
