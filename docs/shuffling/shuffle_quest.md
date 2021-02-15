---
layout: doc
title: Shuffling as flashcard types
nav_order: 4
permalink: /shuffling/shuffling-quest
parent: Shuffling
---

{% include toc-doc.md %}

---
## Shuffling as a flashcard type

Shuffling can also be applied as a [flashcard type](../flashcard), which you can use to test yourself.

{% include codeDisplay.md content=shuffling.assign_shuffle setups="shuffle_quest" buttons=buttons.twoCards %}

Notice that `sort1` is only activated for card 1, `sort2` is only activated for card 2.
This makes them similar to how [clozes](../clozes) behave, for example.

---
## Overview of `shuffle`, `sort`, and `jumble`

Altogether there are three different kinds of these "shuffling as flashcard" types:
- `shuffle`: cards will be shuffled on both sides
- `sort`: cards will be shuffled on the front, but not on the back
- `jumble`: cards will be shuffled on the back, but not the front

---
## Combining with other flashcard types

You can also combine it with other flashcard types:

{% include codeDisplay.md content=shuffling.assign_shuffle_ol setups="shuffle_quest,default_cloze,default_multiple_choice,order" buttons=buttons.fourCards %}
