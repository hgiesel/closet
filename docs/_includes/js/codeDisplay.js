{% assign theId = include.content.name | slugify %}
{% assign theCode = include.content.code | replace: "'", "\\'" | newline_to_br | strip_newlines %}
{% assign fm = include.filterManager %}


{% for button in theButtons %}
{% assign theButton = button | split: ", " %}
readyRenderButton(
    '#{{ theId }} .btn-{{ theButton[1] }}',
    '#{{ theId }} > .display',
    '{{ theCode }}',
    {{ theButton[2] }} /* the preset */,
    {{ theButton[3] }} /* keep memory or not */,
    {% if fm %}
    // inject filterManager
    ((preset) => { {{ fm }} })({{ theButton[2] }}),
    {% endif %}
)
{% endfor %}

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
