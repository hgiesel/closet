from aqt import mw

from ..gui.settings import Settings

from .utils import occlude_shortcut


def set_settings(
    shortcut: str,
):
    occlude_shortcut.value = shortcut


def show_settings():
    dialog = Settings(mw, set_settings)

    dialog.setupUi(occlude_shortcut.value)
    return dialog.exec_()


def init_addon_manager():
    mw.addonManager.setConfigAction(__name__, show_settings)
