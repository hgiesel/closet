from typing import Callable, List
from pathlib import Path
from os.path import basename, dirname, realpath
from os import remove
from glob import glob
import re

from aqt import mw

from anki.models import NoteType

from .version import version
from .utils import flatmap


def get_source(source_name: str) -> Callable[[], str]:
    filepath = Path(dirname(realpath(__file__)), "..", "web", source_name)

    with open(filepath, mode="r", encoding="utf-8") as file:
        return file.read().strip()


closet_js = get_source("closet.js")
closet_css = get_source("closet.css")

# For some reason, esm modules with single leading underscore do not work
closet_file_glob = "__closet*.*"
closet_file_regex = r"^__closet-(.*)\.(.*)$"


def try_get_closet_version(model: NoteType) -> List[str]:
    try:
        return [model["closetVersion"]]
    except KeyError:
        return []


def update_closet() -> None:
    if not (basepath := mw.col.media.dir()):
        return None

    active_closets = set(flatmap(try_get_closet_version, mw.col.models.all()))

    # Avoid using Anki deletion API, so they do not end up in trash
    for file in glob(str(Path(basepath, closet_file_glob))):
        match = re.match(closet_file_regex, basename(file))

        if not match:
            # I will not touch __closet.* for now
            continue

        match_version = match[1]
        match_ending = match[2]

        if match_version not in active_closets or match_ending not in ["js", "css"]:
            remove(file)

    if version in active_closets:
        # No need to replace
        return

    mw.col.media.write_data(f"__closet-{version}.js", closet_js.encode())
    mw.col.media.write_data(f"__closet-{version}.css", closet_css.encode())
