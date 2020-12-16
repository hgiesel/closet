import re

from .simulate_typing import fill_matching_fields


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


def fill_matching_field(indexer):
    def get_value(editor, prefix: str, suffix: str) -> int:
        current_index = indexer(editor, prefix, suffix)
        fill_matching_fields(editor, [current_index])

        return current_index

    return get_value


top_index = fill_matching_field(get_top_index)
incremented_index = fill_matching_field(get_incremented_index)
