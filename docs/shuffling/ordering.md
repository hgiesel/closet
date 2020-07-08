---
layout: doc
title: Preserving item orders
nav_order: 2
permalink: /shuffling/ordering
parent: Shuffling
---

{% include toc-doc.md %}

---
## Ordering

Sometimes you want to shuffle items, however you still want to preserve some relation in the text.
In these cases, the `ord` tag can come in handy.
Let's look at a first example:

{% include codeDisplay.md content=shuffling.on_extra_line setups="default_shuffle,order" buttons=buttons.frontBack %}

In this example, we shuffle the countries, and the capitals.
However we don't want to get countries and capitals to get out of order with each other respectively.
The `ord` tag alters the `mix` tag in a way, that it will still shuffle at random, but preserve this connection.

{% include codeDisplay.md content=shuffling.individual_items setups="default_shuffle,order" buttons=buttons.frontBack %}

When shuffling sentences, the `ord` tag is especially handy, because you can focus on the important parts.

---
## Ordering inline and non-contiguous shuffles

{% include codeDisplay.md content=shuffling.inline_vs_list setups="fancy_shuffle,order" buttons=buttons.frontBack %}

The `ord` tag can also relate values from a `mix` single with individual `mix` tags
