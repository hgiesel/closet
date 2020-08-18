from aqt import QDialogButtonBox, qconnect
from aqt.models import Models

from anki.hooks import wrap
from anki.lang import _

def on_closet(models):
    current_row = models.form.modelsList.currentRow()
    current_id = models.models[current_row].id
    current_notetype = models.mm.get(current_id)

    from aqt.utils import showText
    showText(str(current_notetype))

def init_closet_button(self):
    button = self.form.buttonBox.addButton(_("Closet..."), QDialogButtonBox.ActionRole)
    qconnect(button.clicked, lambda: on_closet(self))

def init_models_dialog():
    Models.setupModels = wrap(Models.setupModels, init_closet_button, pos='after')
