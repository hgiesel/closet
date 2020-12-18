from aqt import mw, dialogs
from aqt.gui_hooks import add_cards_will_add_note
from aqt.qt import QKeySequence
from aqt.utils import shortcut

from .utils import occlude_shortcut


def check_if_occlusion_editor_open(problem, _note):
    addcards = dialogs._dialogs["AddCards"][1]
    shortcut_as_text = shortcut(QKeySequence(occlude_shortcut.value).toString())

    occlusion_problem = (
        (
            "Closet Occlusion Editor is still open.<br>"
            f'Please accept by right-clicking and selecting "Accept" or reject the occlusions by using {shortcut_as_text}.'
        )
        if addcards.editor.occlusion_editor_active
        else None
    )

    return problem or occlusion_problem


def init_addcards():
    add_cards_will_add_note.append(check_if_occlusion_editor_open)
