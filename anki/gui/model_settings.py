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

    def setupUi(self, delimiters: dict):
        self.ui.openingTag.setText(delimiters['tag_open'])
        self.ui.closingTag.setText(delimiters['tag_close'])
        self.ui.argumentSeparator.setText(delimiters['arg_sep'])

    def accept(self):
        self.callback({
            'tag_open': self.ui.openingTag.text(),
            'tag_close': self.ui.closingTag.text(),
            'arg_sep': self.ui.argumentSeparator.text(),
        })

        super().accept()
