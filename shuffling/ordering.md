---
layout: doc
title: Preserving item orders
nav_order: 2
permalink: /shuffling/ordering
parent: Shuffling
---

{% assign b = "Render, render, {}, false" %}

{% include toc-doc.md %}

## Ordering

Sometimes you want to shuffle items, however you still want to preserve some relation in the text.
In these cases, the `ord` tag can come in handy.
Let's look at a first example:

{% capture orderFm %}
filterManager.addRecipe(Closet.recipes.shuffling('mix'))
filterManager.addRecipe(Closet.recipes.ordering('ord', 'mix'))
{% endcapture %}

{% include codeDisplay.md content=site.data.snippets.ordering.first_example filterManager=orderFm buttons=b %}

In this we want to mix the countries, and we want to mix the capitals.
However we don't want to get countries and capitals to get out of order with each other.
The `ord` tag alters the `mix` tag in a way, that it will still shuffle randomly, but preserve this connection.

You can use the `ord` tag in two ways:
- `[[ord::1||2||3]]`
- `[[ord::1,2,3]]`

{% include codeDisplay.md content=site.data.snippets.ordering.individual_items filterManager=orderFm buttons=b %}

When shuffling sentences, the `ord` tag is especially handy, because you can focus on the important parts.

{% capture vsFm %}
filterManager.addRecipe(Closet.recipes.shuffling('mix', new Closet.Stylizer({
  separator: ' vs ',
})))
filterManager.addRecipe(Closet.recipes.ordering('ord', 'mix'))
{% endcapture %}

---

## Ordering inline and non-contiguous shuffles

{% include codeDisplay.md content=site.data.snippets.ordering.inline_vs_list filterManager=vsFm buttons=b %}

The `ord` tag can also relate values from a `mix` single with individual `mix` tags

---
