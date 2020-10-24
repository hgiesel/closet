from aqt.gui_hooks import profile_did_open

from .hook import setup_script, install_script
from .update import update_closet

from .models import init_models_dialog
from .editor import init_editor
from .addon_manager import init_addon_manager


def init():
    setup_script()
    profile_did_open.append(install_script)

    profile_did_open.append(update_closet)

    init_models_dialog()
    init_editor()
    init_addon_manager()
