from aqt.gui_hooks import models_did_init_buttons
from aqt import mw

from anki.lang import _

from .utils import closet_enabled
from ..gui.model_settings import ModelSettings


def set_settings(
    enabled: bool,
):
    closet_enabled.value = enabled

def on_closet(models):
    current_row: int = models.form.modelsList.currentRow()
    model_id: int = models.models[current_row].id

    closet_enabled.model_id = model_id
    dialog = ModelSettings(mw, set_settings)

    dialog.setupUi(closet_enabled.value)
    return dialog.exec_()

def init_closet_button(buttons, models):
    buttons.append((
        _("Closet..."),
        lambda: on_closet(models),
    ))

    return buttons

def init_models_dialog():
    models_did_init_buttons.append(init_closet_button)
