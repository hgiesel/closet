from aqt.gui_hooks import profile_did_open

from .hook import setup_user_script, install_user_script
from .models import init_models_dialog
from .editor import init_editor
from .addon_manager import init_addon_manager

def init():
    setup_user_script()
    profile_did_open.append(install_user_script)

    # init_models_dialog()
    init_editor()
    init_addon_manager()
