import re

from ..simulate_typing import activate_matching_fields


def get_base_top(editor, prefix: str, suffix: str) -> int:
    matches = []
    query = re.escape(prefix) + r"(\d+)" + re.escape(suffix)

    for name, item in editor.note.items():
        matches.extend(re.findall(query, item))

    values = [0]
    values.extend([int(x) for x in matches])

    return max(values)


def get_top_index(editor, prefix: str, suffix: str) -> int:
    base_top = get_base_top(editor, prefix, suffix)

    return base_top + 1 if base_top == 0 else base_top


def get_incremented_index(editor, prefix: str, suffix: str) -> int:
    base_top = get_base_top(editor, prefix, suffix)

    return base_top + 1


def activate_matching_field(indexer):
    def get_value(editor, prefix: str, suffix: str) -> int:
        current_index = indexer(editor, prefix, suffix)
        was_filled = activate_matching_fields(editor, [current_index])[0]

        return current_index if was_filled else 0

    return get_value


def no_index(_editor, _prefix: str, _suffix: str) -> str:
    return ""


def top_index(type_):
    if type_ == "free":
        return get_top_index
    elif type_ == "flashcard":
        return activate_matching_field(get_top_index)
    else:  # type_ == "none":
        return no_index


def incremented_index(type_):
    if type_ == "free":
        return get_incremented_index
    elif type_ == "flashcard":
        return activate_matching_field(get_incremented_index)
    else:  # type_ == "none":
        return no_index
