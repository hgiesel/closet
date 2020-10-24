from aqt import QDialog, QLayout, QKeySequence

from .forms.model_settings_ui import Ui_Settings


class ModelSettings(QDialog):
    def __init__(self, mw, callback):
        super().__init__(parent=mw)

        self.mw = mw

        self.ui = Ui_Settings()
        self.ui.setupUi(self)

        self.callback = callback
        self.ui.saveButton.clicked.connect(self.accept)
        self.ui.cancelButton.clicked.connect(self.reject)

        self.layout().setSizeConstraint(QLayout.SetFixedSize)

    def setupUi(self, closet_enabled: bool):
        self.ui.closetEnabled.setChecked(closet_enabled)

    def accept(self):
        self.callback(
            self.ui.closetEnabled.isChecked(),
        )

        super().accept()
