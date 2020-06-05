---
layout: doc
title: Creating clozes
nav_order: 1
permalink: /clozes/creating-clozes
parent: Clozes
---

{% assign b='Frontside, q, {"side": "front"}, true; Backside, a, {"side": "back"}, true' %}
{% assign bOneTwo='Frontside 1, q1, {side: "front",card: "c1"}, true; Backside 1, a1, {side: "back",card: "c1"}, true; Frontside 2, q2, {side: "front",card: "c2"}, true; Backside 2, a2, {side: "back",card: "c2"}, true' %}
{% assign bOneTwoThree='F1, q1, {side: "front",card: "c1"}, true; B1, a1, {side: "back",card: "c1"}, true; F2, q2, {side: "front",card: "c2"}, true; B2, a2, {side: "back",card: "c2"}, true; F3, q3, {side: "front",card: "c3"}, true; B3, a3, {side: "back",card: "c3"}, true' %}

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

{% capture defaultCloze %}
const fm = new Closet.FilterManager(preset)
fm.addRecipe(Closet.recipes.clozeShow('c'))

return fm
{% endcapture %}

{% include codeDisplay.html content=site.data.snippets.cloze.first_example filterManager=defaultCloze buttons=b %}

## Numbered Clozes

In a flashcard, you would usually want to test each piece of knowledge individually.
Which is is why rather than removing both passages, you'd want to create two flashcards, each removing a single passage, and highlighting it.

For these cards, there is the notion of a _current cloze_.

{% capture numberedCloze %}
const fm = new Closet.FilterManager(preset)
fm.addRecipe(Closet.recipes.clozeShow('c'))

return fm
{% endcapture %}

{% include codeDisplay.html content=site.data.snippets.cloze.numbered_cloze filterManager=numberedCloze buttons=bOneTwo %}

## Showing Clozes and Hiding Clozes

In the above examples non-current clozes simply displayed their content.
These are called _showing clozes_.
You might also instead want to simply hide the content.
This might create less interference for recalling the current cloze.

{% capture hideCloze %}
const fm = new Closet.FilterManager(preset)
fm.addRecipe(Closet.recipes.clozeHide('ch'))
fm.addRecipe(Closet.recipes.clozeShow('c'))

return fm
{% endcapture %}

{% include codeDisplay.html content=site.data.snippets.cloze.hiding_cloze filterManager=hideCloze buttons=bOneTwoThree %}

You can see here, how clozes under the `c` hide their content to avoid context information for the other clozes.

## Hints

Rather than showing the ellipsis symbol, you can also provide a hint instead.
This hint is provided as the second parameter in the tag.

{% include codeDisplay.html content=site.data.snippets.cloze.hints filterManager=hideCloze buttons=bOneTwoThree %}

