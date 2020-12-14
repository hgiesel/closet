from aqt import QDialog, QLayout, QKeySequence

from ..src.version import version
from .forms.settings_ui import Ui_Settings


behaviors = ["autopaste", "copy"]


class Settings(QDialog):
    def __init__(self, mw, callback):
        super().__init__(parent=mw)

        self.mw = mw

        self.ui = Ui_Settings()
        self.ui.setupUi(self)

        self.cb = callback

        self.layout().setSizeConstraint(QLayout.SetFixedSize)

    def setupUi(self, occlude_shortcut: str, occlude_accept_behavior: str) -> None:
        self.ui.occludeShortcut.setKeySequence(QKeySequence(occlude_shortcut))
        self.ui.occlusionAcceptBehavior.setCurrentIndex(
            behaviors.index(occlude_accept_behavior)
        )

        self.ui.versionInfo.setText(f"Closet {version}")

    def accept(self):
        occlude_shortcut = self.ui.occludeShortcut.keySequence().toString()
        occlude_accept_behavior = behaviors[
            self.ui.occlusionAcceptBehavior.currentIndex()
        ]

        self.cb(occlude_shortcut, occlude_accept_behavior)
        super().accept()
