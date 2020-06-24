{% assign theButtons = include.buttons | split: "; " %}

{% assign contentId = include.content.name | slugify %}

{% assign theSetups = include.setups | split: ',' %}

{% assign setupIds = '' | split: '' %}
{% for setup in theSetups %}
  {% assign slugifiedName = setup | slugify %}
  {% assign setupIds = setupIds | push: slugifiedName %}
{% endfor %}

{% assign setupId = theSetups | join: '-and-' %}
{% assign setupString = setupIds | join: ',' %}

{% assign theId = contentId | append: "-with-" | append: setupId %}

{% assign fmCode = '' | split: '' %}

{% capture newLine %}
{% endcapture %}

{% for setup in site.data.setups %}
  {% if theSetups contains setup[0] %}
    {% assign codeSnippetName = "/** " | append: setup[1].name | append: " */" %}
    {% assign code = setup[1].code %}
    {% assign fmCode = fmCode | push: codeSnippetName | push: code %}
  {% endif %}
{% endfor %}

<div class="code-container" markdown="1">
  <div class="code-example" id="{{ theId }}">
    <button class="btn-fm btn-purple btn-outline">setup</button>

    <div class="output-display"></div>

    <div class="btn-group-tester">
      {% for button in theButtons %}
      {% assign theButton = button | split: ", " %}
      <button type="button" name="button" class="btn btn-outline btn-green btn-{{ theButton[1] }}">{{ theButton[0] }}</button>
      {% endfor %}
      <button type="button" name="button" class="btn btn-outline btn-blue btn-edit">Try it yourself</button>
    </div>

    <div class="fm-display">
      <pre><code class="language-js">{{ fmCode | join: newLine | escape_once }}</code></pre>
    </div>

    <script>
      {% include js/codeDisplay.js theId=theId setupString=setupString theButtons=theButtons fmCode=fmCode content=include.content %}
    </script>
  </div>
  {% include codeSection.md %}
</div>
