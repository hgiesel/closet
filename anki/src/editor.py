from pathlib import Path
from os.path import dirname, realpath

from aqt.gui_hooks import editor_did_init_buttons

def add_occlusion_button(buttons, editor):
    file_path = dirname(realpath(__file__))
    icon_path = Path(file_path, '..', 'icons', 'occlude.png')

    buttons.append(editor._addButton(
        str(icon_path.absolute()),
        'Occlude',
        'Put all fields into occlusion mode',
    ))

def init_editor():
    editor_did_init_buttons.append(add_occlusion_button)
