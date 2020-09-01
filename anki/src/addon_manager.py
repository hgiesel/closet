from aqt import mw

from ..gui.settings import Settings

from .utils import occlude_keyword


def set_settings(
    occlude_shortcut: str,
):
    mw.pm.profile[occlude_keyword] = occlude_shortcut

def show_settings():
    dialog = Settings(mw, set_settings)

    occlude = mw.pm.profile.get(occlude_keyword, 'Ctrl+O')

    dialog.setupUi(occlude)
    return dialog.exec_()

def init_addon_manager():
    mw.addonManager.setConfigAction(__name__, show_settings)
