from aqt import mw

from anki.hooks import wrap
from aqt.qt import QDialogButtonBox, qconnect

def onCloset(self):
    current_row = self.form.modelsList.currentRow()
    current_notetype = self.mm.get(self.models[current_row]['id'])
    # current_setting = # (current_notetype)

    from aqt.utils import showInfo
    showInfo('clicked!')

def init_closet_button(self):
    f = self.form
    box = f.buttonBox
    t = QDialogButtonBox.ActionRole
    b = box.addButton(_("Closet..."), t)
    qconnect(b.clicked, self.onCloset)

def setup_models_dialog():
    from aqt.models import Models
    Models.onCloset = onCloset
    Models.setupModels = wrap(Models.setupModels, init_closet_button, pos='after')

from anki.hooks import addHook
from .asset_hook import setup_script, install_script

def setup_hook():
    setup_script()
    addHook('profileLoaded', install_script)
