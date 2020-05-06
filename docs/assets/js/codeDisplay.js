{% assign theId = include.content.name | slugify %}
{% assign theCode = include.content.code | replace: "'", "\\'" | newline_to_br | strip_newlines %}

readyRenderButton(
    '#{{ theId }} .btn-rerender',
    '#{{ theId }} > .display',
    '{{ theCode }}',
)

readyTryButton(
    '#{{ theId }} .btn-edit',
    '{{ theCode }}',
)
