import re
from pathlib import Path
from os.path import dirname, realpath

from anki.hooks import wrap

from aqt import mw
from aqt.editor import Editor
from aqt.gui_hooks import (
    webview_will_set_content,
    webview_did_receive_js_message,
    editor_did_init_buttons,
    # editor_will_munge_html,
)

addon_package = mw.addonManager.addonFromModule(__name__)
mw.addonManager.setWebExports(__name__, r"web/.*(css|js)")

occlusion_container_pattern = re.compile(r'<div class="closet__occlusion-container">(<img.*?>).*?</div>')

def without_occlusion_code(txt):
    if match := re.search(occlusion_container_pattern, txt):
        rawImage = match[1]

        return re.sub(occlusion_container_pattern, rawImage, txt)

    # nothing was found, falsy
    return None

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

    if message.startswith('clearOcclusionMode') and isinstance(context, Editor):
        for index, (name, item) in enumerate(context.note.items()):
            if repl := without_occlusion_code(item):
                js = (
                    f'document.querySelector("#f{index}").innerHTML = "{repl}";'
                    f'pycmd("key:{index}:{context.note.id}:{repl}");'
                )

                context.web.eval(js)

    return handled

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

def remove_occlusion_code(txt, editor):
    if repl := without_occlusion_code(txt):
        return repl

    return txt

def init_editor():
    webview_will_set_content.append(include_closet_code)
    webview_did_receive_js_message.append(accept_copy_to_clipoard)
    editor_did_init_buttons.append(add_occlusion_button)
    # editor_will_munge_html.append(remove_occlusion_code)
    Editor.mungeHTML = wrap(Editor.mungeHTML, lambda editor, txt: remove_occlusion_code(txt, editor) , 'after')
