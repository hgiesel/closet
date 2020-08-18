from pathlib import Path
from os.path import dirname, realpath

from aqt.gui_hooks import editor_did_init_buttons


def put_editor_in_occlusion_mode(editor):
    editor.web.eval('console.log("hi there")')

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
    editor_did_init_buttons.append(add_occlusion_button)
