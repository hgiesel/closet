from pathlib import Path
from os.path import dirname, realpath

from aqt import mw
from aqt.editor import Editor

from aqt.gui_hooks import (
    webview_will_set_content,
    webview_did_receive_js_message,
    editor_did_init_buttons,
)

addon_package = mw.addonManager.addonFromModule(__name__)
mw.addonManager.setWebExports(__name__, r"web/.*(css|js)")

def include_closet_code(webcontent, context):
    if not isinstance(context, Editor):
        return

    webcontent.js.append(f'/_addons/{addon_package}/web/closet.js')
    webcontent.js.append(f'/_addons/{addon_package}/web/editor.js')

def accept_copy_to_clipoard(handled, message, context):
    if message.startswith('copyToClipboard'):
        text = message.split(':', 1)[1]
        mw.app.clipboard().setText(text)

        return (True, None)

def put_editor_in_occlusion_mode(editor):
    editor.web.eval('EditorCloset.occlusionMode()')

def add_occlusion_button(buttons, editor):
    file_path = dirname(realpath(__file__))
    icon_path = Path(file_path, '..', 'icons', 'occlude.png')

    editor._links['occlude'] = put_editor_in_occlusion_mode

    occlusion_button = editor._addButton(
        str(icon_path.absolute()),
        'occlude',
        'Put all fields into occlusion mode',
    )

    buttons.append(occlusion_button)

def init_editor():
    webview_will_set_content.append(include_closet_code)
    webview_did_receive_js_message.append(accept_copy_to_clipoard)
    editor_did_init_buttons.append(add_occlusion_button)
