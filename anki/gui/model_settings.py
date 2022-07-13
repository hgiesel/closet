from aqt import QDialog, QLayout, QKeySequence

from .forms.model_settings_ui import Ui_Settings

from ..src.version import version


class ModelSettings(QDialog):
    def __init__(self, mw, callback):
        super().__init__(parent=mw)

        self.mw = mw

        self.ui = Ui_Settings()
        self.ui.setupUi(self)

        self.callback = callback
        self.ui.saveButton.clicked.connect(self.accept)
        self.ui.cancelButton.clicked.connect(self.reject)

        self.layout().setSizeConstraint(QLayout.SizeConstraint.SetFixedSize)

    def setupUi(
        self,
        closet_enabled: bool,
        closet_version: str,
    ):
        self.ui.closetEnabled.setChecked(closet_enabled)

        uptodate = closet_version == version
        uptodate_text = (
            "(up-to-date)" if uptodate else f"(the add-on is on version {version})"
        )

        self.ui.versionLabel.setText(
            f"Inserted Closet: {closet_version} {uptodate_text}"
        )

    def accept(self):
        self.callback(
            self.ui.closetEnabled.isChecked(),
        )

        super().accept()
