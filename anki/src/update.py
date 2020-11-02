from typing import Callable
from pathlib import Path
from os.path import dirname, realpath
from os import remove
from glob import glob

from aqt import mw


def get_source(source_name: str) -> Callable[[], str]:
    filepath = Path(dirname(realpath(__file__)), '..', 'web', source_name)

    with open(filepath, mode='r', encoding='utf-8') as file:
        return file.read().strip()

closet_js = get_source('closet.js')
closet_css = get_source('closet.css')

# For some reason, esm modules with single leading underscore do not work
closet_file_regex = '__closet*.*'

def update_closet() -> None:
    if not (basepath := mw.col.media.dir()):
        return None

    # Avoid using Anki deletion API, so they do not end up in trash
    for file in glob(str(Path(basepath, closet_file_regex))):
        remove(file)

    mw.col.media.write_data('__closet.js', closet_js.encode())
    mw.col.media.write_data('__closet.css', closet_css.encode())
