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

    return txt

def include_closet_code(webcontent, context):
    if not isinstance(context, Editor):
        return

    webcontent.js.append(f'/_addons/{addon_package}/web/closet.js')
    webcontent.js.append(f'/_addons/{addon_package}/web/editor.js')
    webcontent.css.append(f'/_addons/{addon_package}/web/editor.css')

def process_occlusion_index_text(index_text: str):
    return [] if len(index_text) == 0 else [int(text) for text in index_text.split(',')]

def fill_matching_field(editor, current_index):
    for index, (name, item) in enumerate(editor.note.items()):
        match = re.search(r'\d+$', name)

        if (
            match and
            int(match[0]) == current_index and

            # TODO anki behavior for empty fields is kinda weird right now:
            item in ['', '<br>']
        ):
            js = (
                f'pycmd("key:{index}:{editor.note.id}:active");'
                f'document.querySelector("#f{index}").innerHTML = "active";'
            )

            editor.web.eval(js)

def add_occlusion_messages(handled, message, context):
    if isinstance(context, Editor):

        if message.startswith('copyToClipboard'):
            text = message.split(':', 1)[1]
            mw.app.clipboard().setText(text)

            return (True, None)

        if message.startswith('clearOcclusionMode'):
            _, field_index, txt = message.split(':', 2)
            repl = without_occlusion_code(txt)
            repl_escaped = repl.replace(r'"', r'\"')

            context.web.eval(f'pycmd("key:{field_index}:{context.note.id}:{repl_escaped}")')

            return (True, repl)

        if message.startswith('oldOcclusions'):
            _, src, index_text = message.split(':', 2)
            indices = process_occlusion_index_text(index_text)

            context._old_occlusion_indices = indices

            return (True, None)

        if message.startswith('newOcclusions'):
            _, src, index_text = message.split(':', 2)
            indices = process_occlusion_index_text(index_text)

            fill_indices = set(indices).difference(set(context._old_occlusion_indices))
            for index in fill_indices:
                fill_matching_field(context, index)

            return (True, None)

    return handled

def toggle_occlusion_mode(editor):
    editor.web.eval('EditorCloset.toggleOcclusionMode()')

def add_occlusion_button(buttons, editor):
    file_path = dirname(realpath(__file__))
    icon_path = Path(file_path, '..', 'icons', 'occlude.png')

    editor._links['occlude'] = toggle_occlusion_mode

    occlusion_button = editor._addButton(
        str(icon_path.absolute()),
        'occlude',
        'Put all fields into occlusion mode',
    )

    buttons.append(occlusion_button)

def remove_occlusion_code(txt, editor):
    return without_occlusion_code(txt)

def init_editor():
    webview_will_set_content.append(include_closet_code)
    webview_did_receive_js_message.append(add_occlusion_messages)
    editor_did_init_buttons.append(add_occlusion_button)
    # editor_will_munge_html.append(remove_occlusion_code)
    Editor.mungeHTML = wrap(Editor.mungeHTML, lambda editor, txt: remove_occlusion_code(txt, editor) , 'after')
