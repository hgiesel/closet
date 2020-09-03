from aqt import QDialog, QLayout, QKeySequence

from ..src.version import version
from .forms.settings_ui import Ui_Settings


class Settings(QDialog):
    def __init__(self, mw, callback):
        super().__init__(parent=mw)

        self.mw = mw

        self.ui = Ui_Settings()
        self.ui.setupUi(self)

        self.cb = callback

        self.layout().setSizeConstraint(QLayout.SetFixedSize)

    def setupUi(self, occlude_shortcut: str):
        self.ui.occludeShortcut.setKeySequence(QKeySequence(occlude_shortcut))
        self.ui.versionInfo.setText(f'Closet {version}')

    def accept(self):
        occlude_shortcut = self.ui.occludeShortcut.keySequence().toString()

        self.cb(occlude_shortcut)
        super().accept()
