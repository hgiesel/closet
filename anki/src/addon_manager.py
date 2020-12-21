from typing import Union, Optional

from aqt import mw
from aqt.addons import AddonsDialog
from aqt.gui_hooks import addons_dialog_will_show

from ..gui.settings import Settings

from .utils import occlude_shortcut, occlusion_behavior, max_height, AcceptBehaviors


def set_settings(
    shortcut: str,
    behavior: AcceptBehaviors,
    maxheight: int,
):
    occlude_shortcut.value = shortcut
    occlusion_behavior.value = behavior
    max_height.value = maxheight


addons_current: Optional[AddonsDialog] = None


def save_addons_window(addons):
    global addons_current
    addons_current = addons


def show_settings():
    dialog = Settings(addons_current, set_settings)

    dialog.setupUi(
        occlude_shortcut.value,
        occlusion_behavior.value,
        max_height.value,
    )
    return dialog.open()


def init_addon_manager():
    addons_dialog_will_show.append(save_addons_window)
    mw.addonManager.setConfigAction(__name__, show_settings)
