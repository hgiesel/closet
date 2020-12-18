import re
from pathlib import Path
from os.path import dirname, realpath

from anki.hooks import wrap
from anki.consts import MODEL_STD, MODEL_CLOZE

from aqt import mw
from aqt.qt import QKeySequence, Qt
from aqt.editor import Editor
from aqt.gui_hooks import (
    editor_did_init_buttons,
    editor_did_init_shortcuts,
    editor_will_munge_html,
)
from aqt.utils import shortcut

from ..utils import closet_enabled, occlude_shortcut
from ..simulate_typing import escape_js_text

from .text_wrap import top_index, incremented_index


def toggle_occlusion_mode(editor):
    editor.web.eval("EditorCloset.toggleOcclusionMode()")


def add_occlusion_button(buttons, editor):
    editor.occlusion_editor_active = False

    file_path = dirname(realpath(__file__))
    icon_path = Path(file_path, "..", "..", "icons", "occlude.png")

    shortcut_as_text = shortcut(QKeySequence(occlude_shortcut.value).toString())

    occlusion_button = editor._addButton(
        str(icon_path.absolute()),
        "occlude",
        f"Put all fields into occlusion mode ({shortcut_as_text})",
        disables=False,
    )

    editor._links["occlude"] = toggle_occlusion_mode
    buttons.insert(-1, occlusion_button)


def add_occlusion_shortcut(cuts, editor):
    cuts.append((occlude_shortcut.value, lambda: toggle_occlusion_mode(editor), True))


occlusion_container_pattern = re.compile(
    r'<div class="closet-occlusion-container">(<img.*?>).*?</div>'
)


def remove_occlusion_code(txt: str, _editor) -> str:
    if match := re.search(occlusion_container_pattern, txt):
        rawImage = match[1]

        return re.sub(occlusion_container_pattern, rawImage, txt)

    return txt


def turn_of_occlusion_editor_if_in_field(editor, _field):
    if editor.occlusion_editor_active:
        editor.web.eval("EditorCloset.clearOcclusionMode()")


def on_cloze(editor, _old) -> None:
    model = editor.note.model()

    # This will not overwrite standard clozes
    if model["type"] == MODEL_CLOZE:
        return _old(editor)

    closet_enabled.model = model
    if not closet_enabled.value:
        return _old(editor)

    open = "[[c"
    middle = "::"

    func = (
        top_index if mw.app.keyboardModifiers() & Qt.AltModifier else incremented_index
    )
    index = func(editor, open, middle)

    prefix = escape_js_text(f"{open}{index}{middle}")
    suffix = escape_js_text("]]")

    editor.web.eval(f'wrap("{prefix}", "{suffix}");')


def init_editor():
    editor_did_init_buttons.append(add_occlusion_button)
    editor_did_init_shortcuts.append(add_occlusion_shortcut)
    editor_will_munge_html.append(remove_occlusion_code)

    Editor._onHtmlEdit = wrap(
        Editor._onHtmlEdit, turn_of_occlusion_editor_if_in_field, "before"
    )
    Editor.onCloze = wrap(Editor.onCloze, on_cloze, "around")
