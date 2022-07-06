from typing import List

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
    editor_did_load_note,
    editor_will_munge_html,
)
from aqt.utils import shortcut, showInfo

from ..utils import closet_enabled, closet_version_per_model, occlude_shortcut
from ..simulate_typing import escape_js_text

from .text_wrap import top_index, incremented_index


# code 0 field is optional
trailing_number = re.compile(r"[123456789]\d*$")


def get_max_code_field(editor) -> int:
    number_suffixes = map(
        lambda item: trailing_number.search(item[0]), editor.note.items()
    )
    indices = [suffix[0] for suffix in number_suffixes if suffix]
    sorted_indices = sorted(set([int(index) for index in indices]))

    max = 0
    for index, value in enumerate(sorted_indices):
        # probably skipped an index
        if value != index + 1:
            break

        max = value

    return max


def toggle_occlusion_mode(editor):
    model = editor.note.note_type()

    closet_enabled.model = model
    closet_version_per_model.model = model

    if (
        not closet_enabled.value
        or closet_version_per_model.value == closet_version_per_model.default
    ):
        showInfo(
            "This note type does not seem to support Closet. "
            "Closet needs to be inserted into the card templates using Asset Manager, or you can download a note type which already supports Closet. "
        )
        editor.web.eval("EditorCloset.setInactive()")
        return

    escaped_version = escape_js_text(closet_version_per_model.value)
    max_code_fields = get_max_code_field(editor)

    editor.web.eval(
        f'EditorCloset.toggleOcclusionMode("{escaped_version}", {max_code_fields})'
    )


def add_occlusion_button(buttons, editor):
    file_path = dirname(realpath(__file__))
    icon_path = Path(file_path, "..", "..", "icons", "occlude.png")

    shortcut_as_text = shortcut(QKeySequence(occlude_shortcut.value).toString())

    occlusion_button = editor._addButton(
        str(icon_path.absolute()),
        "occlude",
        f"Put all fields into occlusion mode ({shortcut_as_text})",
        id="closetOcclude",
        disables=False,
    )

    editor._links["occlude"] = toggle_occlusion_mode
    buttons.insert(-1, occlusion_button)


modes = [
    ["Cloze", "c", "Cloze the text", "flashcard"],
    ["Mult. Choice", "mc", "Make a multiple choice question", "flashcard"],
    [
        "Sort Task",
        "sort",
        "Assign the sort elements to their correct place",
        "flashcard",
    ],
    ["Shuffle", "mix", "Randomly shuffle the designated elements", "free"],
    ["Order", "ord", "Maintain a certain order among shuffled elements", "none"],
]


def wrap_as_option(name: str, code: str, tooltip: str, shortcut_text: str) -> str:
    return f'<option title="{tooltip} ({shortcut(shortcut_text)})">{name} [{code}]</option>'


def add_closet_mode_select(buttons, editor):
    modes_as_options: List[str] = list(
        map(
            lambda mode: wrap_as_option(
                mode[1][0], mode[1][1], mode[1][2], f"Ctrl+{mode[0]}"
            ),
            enumerate(modes),
        )
    )

    modes_as_html = "\n".join(modes_as_options)

    closet_mode_select = f"""
<select
    id="closetMode"
    class="closet-select-mode"
    onchange="pycmd(`closetMode:${{this.selectedIndex}}`)"
    tabindex="-1"
>{modes_as_html}</select>"""

    buttons.insert(-1, closet_mode_select)


def add_buttons(buttons, editor):
    editor.occlusion_editor_active = False
    editor.closet_mode = 0

    add_occlusion_button(buttons, editor)
    add_closet_mode_select(buttons, editor)


def set_closet_mode(editor, index: int):
    cmd = f"EditorCloset.setClosetMode({index})"

    editor.web.eval(cmd)
    editor.closet_mode = index


def add_occlusion_shortcut(cuts, editor):
    cuts.append((occlude_shortcut.value, lambda: toggle_occlusion_mode(editor), True))

    def add_closet_mode_shortcut(index):
        shortcut_ = f"Ctrl+{index + 1}"
        cuts.append((shortcut_, lambda: set_closet_mode(editor, index), True))

    for index, _ in enumerate(modes):
        add_closet_mode_shortcut(index)


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

    current_mode = modes[editor.closet_mode]

    code = current_mode[1]
    type_ = current_mode[3]

    open = f"[[{code}"
    middle = "::"

    func = (
        top_index if mw.app.keyboardModifiers() & Qt.AltModifier else incremented_index
    )
    index = func(type_)(editor, open, middle)

    prefix = escape_js_text(f"{open}{index}{middle}")
    suffix = escape_js_text("]]")

    editor.web.eval(f'wrap("{prefix}", "{suffix}");')


def init_editor():
    editor_did_init_buttons.append(add_buttons)
    editor_did_init_shortcuts.append(add_occlusion_shortcut)

    editor_will_munge_html.append(remove_occlusion_code)

    Editor._onHtmlEdit = wrap(
        Editor._onHtmlEdit, turn_of_occlusion_editor_if_in_field, "before"
    )
    Editor.onCloze = wrap(Editor.onCloze, on_cloze, "around")
