{% assign theButtons = include.buttons | split: "; " %}
{% assign fm = include.filterManager | strip %}

<div class="code-container" markdown="1">
  <div class="code-example" id="{{ include.content.name | slugify }}">
    <div class="output-display"></div>

    <div class="btn-group-tester">
      {% for button in theButtons %}
      {% assign theButton = button | split: ", " %}
      <button type="button" name="button" class="btn btn-outline btn-green btn-{{ theButton[1] }}">{{ theButton[0] }}</button>
      {% endfor %}
      <button type="button" name="button" class="btn btn-outline btn-blue btn-edit">Try it yourself</button>
    </div>

    <button class="btn-fm btn-purple btn-outline">fm</button>

    <div class="fm-display">
      <pre><code class="language-js">{{ fm | escape_once }}</code></pre>
    </div>

    <div class="fm-popup">
      Copied to the clipboard!
    </div>

    <script>
      {% include js/codeDisplay.js %}
    </script>
  </div>
  {% include codeSection.md %}
</div>
