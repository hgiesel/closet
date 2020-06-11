---
layout: doc
title: Clozes
nav_order: 5
permalink: clozes
has_children: true
---

{% include toc-doc.md %}

---
## What are clozes?

According to [Wikipedia](https://en.wikipedia.org/wiki/Cloze_test):

> A cloze test (also cloze deletion test) is an exercise, test, or assessment consisting of a portion of language with certain items, words, or signs removed (cloze text), where the participant is asked to replace the missing language item.

---
## Test and answer context

The rendering of the cloze needs to _context-sensitive_.
Depending on the context cloze is rendered, it needs to be rendered differently:

1. as a _test_, it can be rendered as an [ellipsis](https://en.wikipedia.org/wiki/Ellipsis), or a [hint](creating#hints).
The hint might be text provided by the user, or simply the answer, but processed in a specific way, e.g. [obscured, or blanked out](blanking-obscuring).
1. as the _answer_, or _reveal_, it needs to show what was hidden.

For flashcards, _test_ will be synonmymous with the _front_, _answer_ with the _back_.

---
## Active and inactive clozes

In a flashcard, you usually want to test each piece of knowledge individually.
This is also called the [minimum information principle](https://www.supermemo.com/de/archives1990-2015/articles/20rules#minimum%20information%20principle).
In Anki, this is facilitated in the form of cards.


```closet
The capital of Portugal is [[c1::Lisbon]]. Its area is [[c2::92km²]].
```

Using the above template, we could create two different cards, both testing one piece of knowledge on the note.
This introduces the notion of _active_ clozes, compared to _inactive_ ones.

In Anki, on a card `Cloze 1`, the active cloze would be `c1`, whereas `c2` is inactive, and vice versa.
Within Closet we can be more flexibile, but generally we will adhere to this convention.

---
## Summary

Altogether, we can think of a cloze as text which can be rendered in 4 different ways:
* _test_ and _active_
* _test_ and _inactive_
* _answer_ and _active_
* _answer_ and _inactive_
