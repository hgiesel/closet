from typing import List

import re


def is_text_empty(editor, text) -> bool:
    return editor.mungeHTML(text) == ""


def escape_js_text(text: str) -> str:
    return text.replace("\\", "\\\\").replace('"', '\\"').replace("'", "\\'")


def make_insertion_js(field_index: int, text: str) -> str:
    escaped = escape_js_text(text)

    cmd = (
        f"pycmd(`key:{field_index}:${{getNoteId()}}:{escaped}`); "
        f"EditorCloset.setFieldHTML({field_index}, `{escaped}`); "
    )
    return cmd


def insert_into_zero_indexed(editor, text: str) -> None:
    for index, (name, item) in enumerate(editor.note.items()):
        match = re.search(r"\d+$", name)

        if not match or int(match[0]) != 0:
            continue
        
        editor.web.eval(f"EditorCloset.insertIntoZeroIndexed(`{text}`, {index}); ")
        break


def activate_matching_fields(editor, indices: List[int]) -> List[bool]:
    founds = [False for index in indices]

    for index, (name, item) in enumerate(editor.note.items()):
        match = re.search(r"\d+$", name)

        if not match:
            continue

        matched = int(match[0])

        if matched not in indices:
            continue

        founds[indices.index(matched)] = True

        # TODO anki behavior for empty fields is kinda weird right now:
        if not is_text_empty(editor, item):
            continue

        editor.web.eval(make_insertion_js(index, "active"))

    return founds
