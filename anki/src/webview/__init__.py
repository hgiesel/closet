import re
from typing import Tuple, List, Any

from aqt import mw
from aqt.editor import Editor
from aqt.gui_hooks import (
    webview_will_set_content,
    webview_did_receive_js_message,
)
from aqt.utils import showInfo

from ..utils import closet_enabled, closet_version_per_model, occlusion_behavior
from ..version import version
from ..simulate_typing import (
    insert_into_zero_indexed,
    activate_matching_fields,
)


addon_package = mw.addonManager.addonFromModule(__name__)
mw.addonManager.setWebExports(__name__, r"web/.*(css|js)")


def include_closet_code(webcontent, context) -> None:
    if not isinstance(context, Editor):
        return

    webcontent.js.append(f"/_addons/{addon_package}/web/editor.js")
    webcontent.css.append(f"/_addons/{addon_package}/web/editor.css")


def process_occlusion_index_text(index_text: str) -> List[int]:
    return [] if len(index_text) == 0 else [int(text) for text in index_text.split(",")]


def add_occlusion_messages(handled: bool, message: str, context) -> Tuple[bool, Any]:
    if isinstance(context, Editor):
        editor: Editor = context

        if message.startswith("oldOcclusions"):
            _, src, index_text = message.split(":", 2)
            indices = process_occlusion_index_text(index_text)

            editor._old_occlusion_indices = indices

            return (True, None)

        elif message.startswith("newOcclusions"):
            _, src, index_text = message.split(":", 2)
            indices = process_occlusion_index_text(index_text)

            fill_indices = list(
                set(indices).difference(set(editor._old_occlusion_indices))
            )
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


def init_webview():
    webview_will_set_content.append(include_closet_code)
    webview_did_receive_js_message.append(add_occlusion_messages)
