---
layout: doc
title: Shuffling text items
nav_order: 1
permalink: /shuffling/shuffling
parent: Shuffling
---

{% assign b = "Render, render, {}, false" %}

{% include toc-doc.md %}

---

## Inline Shuffling

Items can easily be shuffled using the `mix` tag.
Items to be shuffled must be separated by `||`.

{% capture defaultFm %}
filterManager.addRecipe(Closet.recipes.shuffling('mix'))
{% endcapture %}

{% include codeDisplay.html content=site.data.snippets.shuffling.first_example filterManager=defaultFm buttons=b %}

---

## Shuffling non-contiguous areas

If you want to shuffle non-contiguous areas, you need to use _numbered_ tags.
Instead of using `mix`, you should use `mix1`, `mix2`, etc.

{% include codeDisplay.html content=site.data.snippets.shuffling.non_contiguous filterManager=defaultFm buttons=b %}

When using numbered `mix` tags, they will preserve their original amount of items.

{% include codeDisplay.html content=site.data.snippets.shuffling.preserve_item_count filterManager=defaultFm buttons=b %}

---

## Nested shuffling

You can also shuffle in a nested style.
This is useful if you have multiple levels of logical units, that you want to shuffle around.
Think of shuffling paragraphs, and the sentences within; or sentences, and the words within.

{% include codeDisplay.html content=site.data.snippets.shuffling.nesting filterManager=defaultFm buttons=b %}

### Resolution of nested tags

You can shuffle as one-sided as you want to.
Closet will try to _resolve_ the shuffling in the most logical way possible.
Take a look at the following example:

{% include codeDisplay.html content=site.data.snippets.shuffling.onesided_nesting filterManager=defaultFm buttons=b %}

Closet will start with `mix3` and work its way outside, until it will finally shuffle the `mix1` tags.
If there is no logical way to shuffle the elements, it will cause something called a [deadlock](https://en.wikipedia.org/wiki/Deadlock).

### Deadlocks

{% include codeDisplay.html content=site.data.snippets.shuffling.deadlock filterManager=defaultFm buttons=b %}

In the example above, initially `mix1` will be shuffled.
However after that, `mix2` in the first row will wait for `mix3` to finish; and `mix3` in the second row will wait for `mix2` to finish.
After a few rounds, this operation will time out, and the remaining tags will stay unresolved.

---

## Advanced

{% capture asianFm %}
const colorWheel = function*() {
  while (true) {
    yield 'pink'
    yield 'lime'
    yield 'yellow'
  }
}

const cw = colorWheel()
cw.next()

const asianStylizer = new Closet.Stylizer({
  separator: '・',
  mapper: v => (
    '<span style="color: ' + cw.next().value + ';">' +
    v +
    '</span>'
  ),
  mapperOuter: v => '〈' + v + '〉',
})

filterManager.addRecipe(Closet.recipes.shuffling('mix', asianStylizer))
{% endcapture %}

You can stylize the appearance of shuffled items however you like.

{% include codeDisplay.html content=site.data.snippets.shuffling.japanese filterManager=asianFm buttons=b %}

{% capture mixedFm %}
const middlePoint = new Closet.Stylizer({
  separator: '・',
})

const slash = new Closet.Stylizer({
  separator: ' / ',
})

filterManager.addRecipe(Closet.recipes.shuffling('amix', middlePoint))
filterManager.addRecipe(Closet.recipes.shuffling('mix', slash))
{% endcapture %}

In the case that you want multiple shuffling styles at the same time, you can put each filter on different _keywords_.

{% include codeDisplay.html content=site.data.snippets.shuffling.mixed_styles filterManager=mixedFm buttons=b %}

Note how they items from tags with different keywords don't mix.

For more on setting options, see [here](TODO)
