{% assign theId = include.content.name | slugify %}
{% assign theCode = include.content.code | replace: "'", "\\'" | newline_to_br | strip_newlines %}
{% assign fm = include.filterManager %}

readyRenderButton(
    '#{{ theId }} .btn-rerender',
    '#{{ theId }} > .display',
    '{{ theCode }}',
    {% if fm %}
    // inject filterManager
    (() => { {{ fm }} })(),
    {% endif %}
)

readyTryButton(
    '#{{ theId }} .btn-edit',
    '{{ theCode }}',
)

Prism.languages.plaintext = {
    tagstart: {
        pattern: /\[\[[a-zA-Z]+\d*/u,
        inside: {
            tagstart: /\[\[/u,
            tagname: /[a-zA-Z]+\d*/u,
        },
    },
    tagend: /\]\]/,
    altsep: /\|\|/,
    argsep: /::/,
}
