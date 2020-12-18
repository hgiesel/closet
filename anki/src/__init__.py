from aqt.gui_hooks import profile_did_open

from .hook import setup_script, install_script
from .update import update_closet

from .webview import init_webview
from .editor import init_editor
from .addcards import init_addcards

from .models import init_models_dialog
from .addon_manager import init_addon_manager


def init():
    setup_script()
    profile_did_open.append(install_script)
    profile_did_open.append(update_closet)

    init_webview()
    init_editor()
    init_addcards()

    init_models_dialog()
    init_addon_manager()
