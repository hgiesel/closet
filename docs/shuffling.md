---
layout: doc
title: Shuffling
nav_order: 1
permalink: /recipes/shuffling
parent: Recipes
---

# Shuffling items

Items can easily be shuffled using the `mix` tag. Items to be shuffled must be separated by `||`.

{% capture defaultFm %}
const fm = new FilterManager()
fm.addRecipe(filterRecipes.shuffling('mix', ', '))

return fm
{% endcapture %}

{% include codeDisplay.html content=site.data.snippets.shuffling_first_example filterManager=defaultFm %}

If you want to shuffle non-contiguous areas, you need to use _numbered_ tags.
Instead of using `mix`, you should use `mix1`, `mix2`, etc.

{% include codeDisplay.html content=site.data.snippets.shuffling_non_contiguous filterManager=defaultFm %}





If you do not pay attention to the nesting of the tags you can create a deadlock.

