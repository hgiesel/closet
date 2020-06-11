{% assign contentId = include.content.name | slugify %}
{% assign contentCode = include.content.code | replace: "'", "\\'" | strip | newline_to_br | strip_newlines %}

{% assign fmId = include.filterManager.name | slugify %}
{% assign fmCode = include.filterManager.code | strip %}

{% assign theId = contentId | append: "-with-" | append: fmId %}

{% for button in theButtons %}
{% assign theButton = button | split: ", " %}
readyRenderButton(
    '#{{ theId }}',
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
    '#{{ theId }}',
    `{{ fmCode | replace: "`", "\\`" | replace: "$", "\\$" }}`,
)

readyTryButton(
    '#{{ theId }}',
    '{{ contentCode }}',
    '{{ fmId }}',
)
