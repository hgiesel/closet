from typing import Callable, List
from pathlib import Path
from os.path import basename, dirname, realpath
from os import remove, getcwd
from glob import glob
import re

from aqt import mw

from anki.models import NoteType

from .version import version
from .utils import closet_version_per_model, DEBUG


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
    closet_version_per_model.model = model
    return closet_version_per_model.value


def update_closet() -> None:
    if not (basepath := mw.col.media.dir()):
        return None

    active_closets = set(map(try_get_closet_version, mw.col.models.all()))

    encountered_js = False
    encountered_css = False

    # Avoid using Anki deletion API, so they do not end up in trash
    for file in glob(str(Path(basepath, closet_file_glob))):
        match = re.match(closet_file_regex, basename(file))

        if not match:
            # TODO I will not touch __closet.* for now
            continue

        match_version = match[1]
        match_ending = match[2]

        if match_version == version:
            if match_ending == "js":
                encountered_js = True
            elif match_ending == "css":
                encountered_css = True

        elif match_version not in active_closets or match_ending not in ["js", "css"]:
            remove(file)

    current_js_file = f"__closet-{version}.js"
    current_css_file = f"__closet-{version}.css"

    # force refresh
    if DEBUG:
        print(f"Will force-refresh current Closet JS and CSS to {version}")

        if encountered_js:
            remove(f"{basepath}/{current_js_file}")
            encountered_js = False

        if encountered_css:
            remove(f"{basepath}/{current_css_file}")
            encountered_css = False

    if not encountered_js:
        mw.col.media.write_data(current_js_file, closet_js.encode())

    if not encountered_css:
        mw.col.media.write_data(current_css_file, closet_css.encode())
