{% capture newLine %}
{% endcapture %}

{% assign contentCode = include.content.code | replace: "'", "\\'" | strip | newline_to_br | strip_newlines %}
{% assign fmCode = include.fmCode | join: newLine | strip %}

console.log(`{{ contentCode }}`)

{% for button in include.theButtons %}
{% assign theButton = button | split: ", " %}
readyRenderButton(
    '#{{ include.theId }}',
    '{{ theButton[1] }}',
    '{{ contentCode }}',
    {{ theButton[2] }} /* the preset */,
    {{ theButton[3] }} /* keep memory or not */,
    // inject filterManager
    ((preset) => {
        const filterManager = new Closet.FilterManager(preset)
        {{ fmCode }}
        return filterManager
    })({{ theButton[2] }}),
)
{% endfor %}

readyFmButton(
    '#{{ include.theId }}',
    `{{ fmCode | replace: "`", "\\`" | replace: "$", "\\$" }}`,
)

readyTryButton(
    '#{{ include.theId }}',
    '{{ contentCode }}',
    '{{ include.setupId }}',
)
