DIR="$(cd "$(dirname "$0")/../anki" && pwd -P)"

mkdir -p "$DIR/gui/forms/qt5" "$DIR/gui/forms/qt6"

for filename in "$DIR/designer/"*'.ui'; do
  python -m PyQt5.uic.pyuic "$filename" > "$DIR/gui/forms/qt5/$(basename ${filename%.*})_ui.py"
  python -m PyQt6.uic.pyuic "$filename" > "$DIR/gui/forms/qt6/$(basename ${filename%.*})_ui.py"
done

echo 'Was successfully compiled!'
