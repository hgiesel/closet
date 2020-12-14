from typing import List, Tuple, Any

import re
from pathlib import Path
from os.path import dirname, realpath

from anki.hooks import wrap

from aqt import mw
from aqt.qt import QKeySequence
from aqt.editor import Editor
from aqt.gui_hooks import (
    webview_will_set_content,
    webview_did_receive_js_message,
    editor_did_init_buttons,
    editor_did_init_shortcuts,
    editor_will_munge_html,
)

from .utils import occlude_shortcut, occlusion_behavior
from .version import version


addon_package = mw.addonManager.addonFromModule(__name__)
mw.addonManager.setWebExports(__name__, r"web/.*(css|js)")

occlusion_container_pattern = re.compile(
    r'<div class="closet-occlusion-container">(<img.*?>).*?</div>'
)


def include_closet_code(webcontent, context) -> None:
    if not isinstance(context, Editor):
        return

    webcontent.js.append(f"/_addons/{addon_package}/web/editor.js")
    webcontent.css.append(f"/_addons/{addon_package}/web/editor.css")


def process_occlusion_index_text(index_text: str) -> List[int]:
    return [] if len(index_text) == 0 else [int(text) for text in index_text.split(",")]


def make_insertion_js(field_index: int, note_id: int, text: str) -> str:
    escaped = text.replace("\\", "\\\\").replace('"', '\\"')

    cmd = (
        f'pycmd("key:{field_index}:{note_id}:{escaped}"); '
        f'document.querySelector("#f{field_index}").innerHTML = "{escaped}";'
    )
    return cmd


def replace_or_prefix_old_occlusion_text(old_html: str, new_text: str) -> str:
    occlusion_block_regex = r"\[#!autogen.*?#\]"

    new_html = "<br>".join(new_text.splitlines())
    replacement = f"[#!autogen {new_html} #]"

    subbed, number_of_subs = re.subn(occlusion_block_regex, replacement, old_html)

    if number_of_subs > 0:
        return subbed
    elif old_html in ["", "<br>"]:
        return replacement
    else:
        return f"{replacement}<br>{old_html}"


def insert_into_zero_indexed(editor, text: str) -> None:
    for index, (name, item) in enumerate(editor.note.items()):
        match = re.search(r"\d+$", name)

        if not match or int(match[0]) != 0:
            continue

        get_content_js = f'document.querySelector("#f{index}").innerHTML;'

        editor.web.evalWithCallback(
            get_content_js,
            lambda old_html: editor.web.eval(
                make_insertion_js(
                    index,
                    editor.note.id,
                    replace_or_prefix_old_occlusion_text(old_html, text),
                )
            ),
        )
        break


def fill_matching_fields(editor, indices: List[int]) -> None:
    for index, (name, item) in enumerate(editor.note.items()):
        match = re.search(r"\d+$", name)

        if (
            not match
            or int(match[0]) not in indices
            # TODO anki behavior for empty fields is kinda weird right now:
            or item not in ["", "<br>"]
        ):
            continue

        editor.web.eval(make_insertion_js(index, editor.note.id, "active", "active"))


def add_occlusion_messages(handled: bool, message: str, context) -> Tuple[bool, Any]:
    if isinstance(context, Editor):

        if message.startswith("closetVersion"):
            return (True, version)

        if message.startswith("occlusionText"):
            text = message.split(":", 1)[1]

            if occlusion_behavior.value == "autopaste":
                insert_into_zero_indexed(context, text)
            else:  # occlusion_behavior.value == 'copy':
                mw.app.clipboard().setText(text)

            return (True, None)

        if message.startswith("oldOcclusions"):
            _, src, index_text = message.split(":", 2)
            indices = process_occlusion_index_text(index_text)

            context._old_occlusion_indices = indices

            return (True, None)

        if message.startswith("newOcclusions"):
            _, src, index_text = message.split(":", 2)
            indices = process_occlusion_index_text(index_text)

            fill_indices = set(indices).difference(set(context._old_occlusion_indices))
            fill_matching_fields(context, fill_indices)

            return (True, None)

    return handled


def toggle_occlusion_mode(editor):
    editor.web.eval("EditorCloset.toggleOcclusionMode()")


def add_occlusion_button(buttons, editor):
    file_path = dirname(realpath(__file__))
    icon_path = Path(file_path, "..", "icons", "occlude.png")

    shortcut_as_text = QKeySequence(occlude_shortcut.value).toString(
        QKeySequence.NativeText
    )

    occlusion_button = editor._addButton(
        str(icon_path.absolute()),
        "occlude",
        f"Put all fields into occlusion mode ({shortcut_as_text})",
        disables=False,
    )

    editor._links["occlude"] = toggle_occlusion_mode
    buttons.insert(-1, occlusion_button)


def add_occlusion_shortcut(cuts, editor):
    cuts.append((occlude_shortcut.value, lambda: toggle_occlusion_mode(editor)))


def remove_occlusion_code(txt: str, _editor) -> str:
    if match := re.search(occlusion_container_pattern, txt):
        rawImage = match[1]

        return re.sub(occlusion_container_pattern, rawImage, txt)

    return txt


def init_editor():
    webview_will_set_content.append(include_closet_code)
    webview_did_receive_js_message.append(add_occlusion_messages)

    editor_did_init_buttons.append(add_occlusion_button)
    editor_did_init_shortcuts.append(add_occlusion_shortcut)
    editor_will_munge_html.append(remove_occlusion_code)
