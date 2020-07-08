---
layout: doc
title: Guess correct order
nav_order: 3
permalink: /shuffling/shuffling-quest
parent: Shuffling
---

{% include toc-doc.md %}

---
## Inline Shuffling

Simple shuffling also exists as a flashcard type, which you can use to test yourself.

{% include codeDisplay.md content=shuffling.assign_shuffle setups="shuffle_quest" buttons=buttons.frontBack %}

It's especially useful when combining with other flashcard types.

{% include codeDisplay.md content=shuffling.assign_shuffle_ol setups="shuffle_quest,default_cloze,default_multiple_choice,order" buttons=buttons.fourCards %}
