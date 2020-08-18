from aqt.gui_hooks import profile_did_open

from .base_hook import setup_script, install_script
from .pass_hook import setup_pass_script, install_pass_script

from .models import init_models_dialog

def init():
    setup_script()
    profile_did_open.append(install_script)

    setup_pass_script()
    profile_did_open.append(install_pass_script)

    init_models_dialog()
