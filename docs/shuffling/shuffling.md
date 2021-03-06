---
layout: doc
title: Shuffling text items
nav_order: 1
permalink: /shuffling/shuffling
parent: Shuffling
---

{% include toc-doc.md %}

---
## Inline Shuffling

Items can easily be shuffled using the `mix` tag.
Items to be shuffled must be separated by `||`.

{% include codeDisplay.md content=shuffling.first_example setups="default_shuffle" buttons=buttons.frontBack %}

---
## Shuffling non-contiguous areas

If you want to shuffle non-contiguous areas, you need to use _numbered_ tags.
Instead of using `mix`, you should use `mix1`, `mix2`, etc.

{% include codeDisplay.md content=shuffling.non_contiguous setups="default_shuffle" buttons=buttons.frontBack %}

When using numbered `mix` tags, they will preserve their original amount of items.

{% include codeDisplay.md content=shuffling.preserve_item_count setups="default_shuffle" buttons=buttons.frontBack %}

---
## Nested shuffling

You can also shuffle in a nested style.
This is useful if you have multiple levels of logical units, that you want to shuffle around.
Think of shuffling paragraphs, and the sentences within; or sentences, and the words within.

{% include codeDisplay.md content=shuffling.nesting setups="default_shuffle" buttons=buttons.frontBack %}

### Resolution of nested tags

You can shuffle as one-sided as you want to.
Closet will try to _resolve_ the shuffling in the most logical way possible.
Take a look at the following example:

{% include codeDisplay.md content=shuffling.onesided_nesting setups="default_shuffle" buttons=buttons.frontBack %}

Closet will start with `mix3` and work its way outside, until it will finally shuffle the `mix1` tags.
If there is no logical way to shuffle the elements, it will cause something called a [deadlock](https://en.wikipedia.org/wiki/Deadlock).

### Deadlocks

{% include codeDisplay.md content=shuffling.deadlock setups="default_shuffle" buttons=buttons.frontBack %}

In the example above, initially `mix1` will be shuffled.
However after that, `mix2` in the first row will wait for `mix3` to finish; and `mix3` in the second row will wait for `mix2` to finish.
After a few rounds, this operation will time out, and the remaining tags will stay unresolved.

---
## Advanced

You can stylize the appearance of shuffled items however you like.

{% include codeDisplay.md content=shuffling.japanese setups="fancy_shuffle" buttons=buttons.frontBack %}

In the case that you want multiple shuffling styles at the same time, you can put each filter on different _keywords_.

{% include codeDisplay.md content=shuffling.mixed_styles setups="fancy_shuffle" buttons=buttons.frontBack %}

Note how they items from tags with different keywords don't mix.

For more on setting options, see [here](TODO)
