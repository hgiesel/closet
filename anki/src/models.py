from aqt.gui_hooks import models_did_init_buttons
from aqt import mw

from anki.lang import _

from .utils import delimiters
from ..gui.model_settings import ModelSettings


def set_settings(
    new_delimiters: dict,
):
    delimiters.value = new_delimiters

def on_closet(models):
    current_row: int = models.form.modelsList.currentRow()
    model_id: int = models.models[current_row].id

    delimiters.model_id = model_id
    dialog = ModelSettings(mw, set_settings)

    dialog.setupUi(delimiters.value)
    return dialog.exec_()

def init_closet_button(buttons, models):
    buttons.append((
        _("Closet..."),
        lambda: on_closet(models),
    ))

    return buttons

def init_models_dialog():
    models_did_init_buttons.append(init_closet_button)
