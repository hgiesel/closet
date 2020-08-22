{% capture newLine %}
{% endcapture %}

{% assign contentCode = include.content.code | replace: "'", "\\'" | strip | newline_to_br | strip_newlines %}
{% assign fmCode = include.fmCode | join: newLine | strip %}

{% assign fmName = include.theId | replace: "-", "" | replace: "_", "" %}

const {{ fmName }}filterManager = Closet.FilterManager.make()

const {{ fmName }}func = (filterManager) => {
    {{ fmCode }}
    return filterManager
}

{{ fmName }}func({{ fmName }}filterManager)

{% for button in include.theButtons %}
{% assign theButton = button | split: ", " %}

readyRenderButton(
    '#{{ include.theId }}',
    '{{ theButton[1] }}',
    '{{ contentCode }}',
    {{ theButton[2] }} /* the preset */,
    {{ fmName }}filterManager /* filterManager */,
){% if forloop.first == true %}.dispatchEvent(new Event('click')){% endif %}
{% endfor %}

readyFmButton(
    '#{{ include.theId }}',
    `{{ fmCode | replace: "`", "\\`" | replace: "$", "\\$" }}`,
)

readyTryButton(
    '#{{ include.theId }}',
    '{{ contentCode }}',
    '{{ include.setupString }}',
)
