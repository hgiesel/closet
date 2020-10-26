from pathlib import Path
from os.path import dirname, realpath
from os import remove
from glob import glob

from aqt import mw


# For some reason, esm modules with single leading underscore do not work
def get_closet_source() -> str:
    filepath = Path(dirname(realpath(__file__)), '..', 'web', 'closet.js')

    with open(filepath, mode='r', encoding='utf-8') as file:
        return file.read().strip()

closet_filename = '__closet.js'
closet_file_regex = '__closet*.js'

def update_closet() -> None:
    if not (basepath := mw.col.media.dir()):
        return None

    # We avoid using Anki deletion API, so they do not end up in trash
    for file in glob(str(Path(basepath, closet_file_regex))):
        remove(file)

    written = mw.col.media.write_data('__closet.js', get_closet_source().encode())

    from aqt.utils import showText
    showText(f'{written=}')
