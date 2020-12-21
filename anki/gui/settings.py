from aqt import QDialog, QLayout, QKeySequence

from ..src.version import version
from .forms.settings_ui import Ui_Settings


behaviors = ["autopaste", "copy"]


class Settings(QDialog):
    def __init__(self, parent, callback):
        super().__init__(parent=parent)

        self.ui = Ui_Settings()
        self.ui.setupUi(self)

        self.cb = callback
        self.layout().setSizeConstraint(QLayout.SetFixedSize)

    def setupUi(
        self, occlude_shortcut: str, occlude_accept_behavior: str, max_height: int
    ) -> None:
        self.ui.occludeShortcut.setKeySequence(QKeySequence(occlude_shortcut))
        self.ui.occlusionAcceptBehavior.setCurrentIndex(
            behaviors.index(occlude_accept_behavior)
        )
        self.ui.maxHeight.setValue(max_height)

        self.ui.versionInfo.setText(f"Closet {version}")

    def accept(self):
        occlude_shortcut = self.ui.occludeShortcut.keySequence().toString()
        occlude_accept_behavior = behaviors[
            self.ui.occlusionAcceptBehavior.currentIndex()
        ]
        max_height = self.ui.maxHeight.value()

        self.cb(occlude_shortcut, occlude_accept_behavior, max_height)
        super().accept()
