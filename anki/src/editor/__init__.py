from typing import List, Tuple, Any

import re
from pathlib import Path
from os.path import dirname, realpath

from anki.hooks import wrap
from anki.consts import MODEL_STD, MODEL_CLOZE

from aqt import mw, dialogs
from aqt.qt import QKeySequence, Qt
from aqt.editor import Editor
from aqt.gui_hooks import (
    webview_will_set_content,
    webview_did_receive_js_message,
    editor_did_init_buttons,
    editor_did_init_shortcuts,
    editor_will_munge_html,
    add_cards_will_add_note,
)
from aqt.utils import shortcut, showInfo

from ..utils import closet_enabled, closet_version_per_model, occlude_shortcut, occlusion_behavior
from ..version import version

from .simulate_typing import (
    insert_into_zero_indexed,
    activate_matching_fields,
    escape_js_text,
)
from .text_wrap import top_index, incremented_index


addon_package = mw.addonManager.addonFromModule(__name__)
mw.addonManager.setWebExports(__name__, r"web/.*(css|js)")

occlusion_container_pattern = re.compile(
    r'<div class="closet-occlusion-container">(<img.*?>).*?</div>'
)


# code 0 field is optional
trailing_number = re.compile(r"[123456789]\d*$")
def get_max_code_field(editor) -> int:
    number_suffixes = map(lambda item: trailing_number.search(item[0]), editor.note.items())
    indices = [suffix[0] for suffix in number_suffixes if suffix]
    sorted_indices = sorted(set([int(index) for index in indices]))

    max = 0
    for index, value in enumerate(sorted_indices):
        # probably skipped an index
        if value != index + 1:
            break

        max = value

    return max


def include_closet_code(webcontent, context) -> None:
    if not isinstance(context, Editor):
        return

    webcontent.js.append(f"/_addons/{addon_package}/web/editor.js")
    webcontent.css.append(f"/_addons/{addon_package}/web/editor.css")


def process_occlusion_index_text(index_text: str) -> List[int]:
    return [] if len(index_text) == 0 else [
        int(text) for text in index_text.split(",")
    ]


def add_occlusion_messages(handled: bool, message: str, context) -> Tuple[bool, Any]:
    if isinstance(context, Editor):
        editor: Editor = context

        if message == "closetVersion":
            return (True, version)

        elif message == "occlusionOptions":
            model = editor.note.model()

            closet_enabled.model = model
            closet_version_per_model.model = model

            if not closet_enabled.value or closet_version_per_model.value == closet_version_per_model.default:
                showInfo(
                    "This note type does not seem to support Closet. "
                    "Closet needs to be inserted into the card templates using Asset Manager, or you can download a note type which already supports Closet. "
                )

                return (True, [False, -1])

            return (True, [
                True,
                get_max_code_field(editor),
            ])

        elif message.startswith("oldOcclusions"):
            _, src, index_text = message.split(":", 2)
            indices = process_occlusion_index_text(index_text)

            editor._old_occlusion_indices = indices

            return (True, None)

        elif message.startswith("newOcclusions"):
            _, src, index_text = message.split(":", 2)
            indices = process_occlusion_index_text(index_text)

            fill_indices = set(indices).difference(set(editor._old_occlusion_indices))
            could_fill = activate_matching_fields(editor, fill_indices)

            return (True, could_fill)

        elif message.startswith("occlusionText"):
            text = message.split(":", 1)[1]

            if occlusion_behavior.value == "autopaste":
                insert_into_zero_indexed(editor, text)
            else:  # occlusion_behavior.value == 'copy':
                mw.app.clipboard().setText(text)

            return (True, None)

        elif message == "occlusionEditorActive":
            editor.occlusion_editor_active = True
            return (True, None)

        elif message == "occlusionEditorInactive":
            editor.occlusion_editor_active = False
            return (True, None)

    return handled


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


def check_if_occlusion_editor_open(problem, _note):
    addcards = dialogs._dialogs["AddCards"][1]
    shortcut_as_text = shortcut(QKeySequence(occlude_shortcut.value).toString())

    occlusion_problem = (
        (
            "Closet Occlusion Editor is still open.<br>"
            f'Please accept by right-clicking and selecting "Accept" or reject the occlusions by using {shortcut_as_text}.'
        )
        if addcards.editor.occlusion_editor_active
        else None
    )

    return problem or occlusion_problem


def init_editor():
    webview_will_set_content.append(include_closet_code)
    webview_did_receive_js_message.append(add_occlusion_messages)

    editor_did_init_buttons.append(add_occlusion_button)
    editor_did_init_shortcuts.append(add_occlusion_shortcut)
    editor_will_munge_html.append(remove_occlusion_code)

    Editor._onHtmlEdit = wrap(
        Editor._onHtmlEdit, turn_of_occlusion_editor_if_in_field, "before"
    )
    Editor.onCloze = wrap(Editor.onCloze, on_cloze, "around")

    add_cards_will_add_note.append(check_if_occlusion_editor_open)
