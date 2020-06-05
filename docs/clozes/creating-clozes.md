---
layout: doc
title: Creating clozes
nav_order: 1
permalink: /clozes/creating-clozes
parent: Clozes
---

{% include toc-doc.md %}

## What are Clozes?

According to [Wikipedia](https://en.wikipedia.org/wiki/Cloze_test):

> A cloze test (also cloze deletion test) is an exercise, test, or assessment consisting of a portion of language with certain items, words, or signs removed (cloze text), where the participant is asked to replace the missing language item.

The rendering of the cloze needs to _context-sensitive_.
Depending on where the cloze is rendered, it needs to be rendered differently:

1. as a _test_, it needs to be rendered as an [ellipsis](https://en.wikipedia.org/wiki/Ellipsis), or a hint, if one is available
1. as an _answer_, or a _reveal_, it needs to show what was originally hidden

In the context of flashcards, _test_ will be synonmymous with the front of the flashcard, the _answer_ with the back.

## Creating Clozes

The cloze text is surrounded by a `c` tag.

{% capture firstCloze %}
const fm = new Closet.FilterManager(preset)
fm.addRecipe(Closet.recipes.cloze('c'))

return fm
{% endcapture %}

{% include codeDisplay.html content=site.data.snippets.cloze.first_example filterManager=defaultFm buttons='Frontside, q, {"side": "front"}, true; Backside, a, {"side": "back"}, true'%}
