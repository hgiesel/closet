---
layout: doc
title: Preserving item orders
nav_order: 2
permalink: /shuffling/ordering
parent: Shuffling
---

{% assign b = "Render, render, {}, false" %}

{% assign shuffling = site.data.snippets.shuffling %}
{% assign setups = site.data.setups %}

{% include toc-doc.md %}

---
## Ordering

Sometimes you want to shuffle items, however you still want to preserve some relation in the text.
In these cases, the `ord` tag can come in handy.
Let's look at a first example:

{% include codeDisplay.md content=shuffling.on_extra_line setups="shuffle_order" buttons=b %}

In this example, we shuffle the countries, and the capitals.
However we don't want to get countries and capitals to get out of order with each other respectively.
The `ord` tag alters the `mix` tag in a way, that it will still shuffle at random, but preserve this connection.

{% include codeDisplay.md content=shuffling.individual_items setups="shuffle_order" buttons=b %}

When shuffling sentences, the `ord` tag is especially handy, because you can focus on the important parts.

---
## Ordering inline and non-contiguous shuffles

{% include codeDisplay.md content=shuffling.inline_vs_list setups="fancy_shuffle" buttons=b %}

The `ord` tag can also relate values from a `mix` single with individual `mix` tags
