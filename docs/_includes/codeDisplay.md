{% assign theButtons = include.buttons | split: "; " %}

{% assign contentId = include.content.name | slugify %}

{% assign fmId = include.filterManager.name | slugify %}
{% assign fmCode = include.filterManager.code | strip %}

{% assign theId = contentId | append: "-with-" | append: fmId %}

<div class="code-container" markdown="1">
  <div class="code-example" id="{{ theId }}">
    <button class="btn-fm btn-purple btn-outline">fm</button>

    <div class="output-display"></div>

    <div class="btn-group-tester">
      {% for button in theButtons %}
      {% assign theButton = button | split: ", " %}
      <button type="button" name="button" class="btn btn-outline btn-green btn-{{ theButton[1] }}">{{ theButton[0] }}</button>
      {% endfor %}
      <button type="button" name="button" class="btn btn-outline btn-blue btn-edit">Try it yourself</button>
    </div>

    <div class="fm-display">
      <pre><code class="language-js">{{ fmCode | escape_once }}</code></pre>
    </div>

    <script>
      {% include js/codeDisplay.js %}
    </script>
  </div>
  {% include codeSection.md %}
</div>
