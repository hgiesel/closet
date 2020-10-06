from aqt import QDialogButtonBox, qconnect
from aqt.models import Models
from aqt.gui_hooks import models_did_init_buttons

from anki.hooks import wrap
from anki.lang import _

def on_closet(models):
    current_row: int = models.form.modelsList.currentRow()
    current_id: int = models.models[current_row].id
    current_notetype = models.mm.get(current_id)

    from aqt.utils import showText
    showText(str(current_notetype))

def init_closet_button(buttons, models):
    buttons.append((
        _("Closet..."),
        lambda: on_closet(models),
    ))

    return buttons

def init_models_dialog():
    models_did_init_buttons.append(init_closet_button)
