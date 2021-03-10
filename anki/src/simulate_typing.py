from typing import List

import re


def is_text_empty(editor, text) -> bool:
    return editor.mungeHTML(text) == ""


def escape_js_text(text: str) -> str:
    return text.replace("\\", "\\\\").replace('"', '\\"').replace("'", "\\'")


def make_insertion_js(field_index: int, text: str) -> str:
    escaped = escape_js_text(text)

    cmd = (
        f'pycmd(`key:{field_index}:${{getNoteId()}}:{escaped}`); '
        f'getEditorField({field_index}).editingArea.fieldHTML = `{escaped}`; '
    )
    return cmd


def replace_or_prefix_old_occlusion_text(editor, old_html: str, new_text: str) -> str:
    occlusion_block_regex = r"\[#!occlusions.*?#\]"

    new_html = "<br>".join(new_text.splitlines())
    replacement = f"[#!occlusions {new_html} #]"

    subbed, number_of_subs = re.subn(occlusion_block_regex, replacement, old_html)

    if number_of_subs > 0:
        return subbed
    elif is_text_empty(editor, old_html):
        return replacement
    else:
        return f"{replacement}<br>{old_html}"


def insert_into_zero_indexed(editor, text: str) -> None:
    for index, (name, item) in enumerate(editor.note.items()):
        match = re.search(r"\d+$", name)

        if not match or int(match[0]) != 0:
            continue

        get_content_js = f'getEditorField({index}).editingArea.fieldHTML; '

        editor.web.evalWithCallback(
            get_content_js,
            lambda old_html: editor.web.eval(
                make_insertion_js(
                    index,
                    replace_or_prefix_old_occlusion_text(editor, old_html, text),
                )
            ),
        )
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
