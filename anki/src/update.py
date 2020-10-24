from pathlib import Path
from os.path import dirname, realpath

from aqt import mw

def get_closet_source() -> str:
    filepath = Path(dirname(realpath(__file__)), '..', 'web', 'closet.js')

    with open(filepath, mode='r', encoding='utf-8') as file:
        return file.read().strip()

def update_closet() -> None:
    # for some reason, esm modules with single leading underscore don't work
    # we need to use two
    mw.col.media.trash_files(['_closet.js', '__closet.js'])
    mw.col.media.write_data('__closet.js', get_closet_source().encode())
