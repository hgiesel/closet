---
layout: doc
title: Activating selectively
nav_order: 1
permalink: flashcard/activating-selectively
parent: Flashcard Types
---

{% assign b='Frontside, q, {"side": "front"}, true; Backside, a, {"side": "back"}, true' %}
{% assign bOneTwo='Frontside 1, q1, {side: "front",card: "c1"}, true; Backside 1, a1, {side: "back",card: "c1"}, true; Frontside 2, q2, {side: "front",card: "c2"}, true; Backside 2, a2, {side: "back",card: "c2"}, true' %}
{% assign bOneTwoThree='F1, q1, {side: "front",card: "c1"}, true; B1, a1, {side: "back",card: "c1"}, true; F2, q2, {side: "front",card: "c2"}, true; B2, a2, {side: "back",card: "c2"}, true; F3, q3, {side: "front",card: "c3"}, true; B3, a3, {side: "back",card: "c3"}, true' %}

{% assign cloze = site.data.snippets.cloze %}
{% assign setups = site.data.setups %}

{% include toc-doc.md %}

---
## Selectively activating tags

You can largely change which cards are considered active, using _activation_ and _deactivation_ tags.
This is especially useful when you use card sections (TODO).

{% include codeDisplay.md content=cloze.activate_cloze setups="default_cloze,flashcard" buttons=bOneTwoThree %}

### Using occurrence numbers

Using the notation `fulltag:occurence`, you can go into more detail when specifying clozes.
All tags are enumerated while they are generated, starting at `0`.
This way you can specifically choose which cloze to activate, even if they share the same name.

{% include codeDisplay.md content=cloze.activate_cloze_with_occur setups="default_cloze,flashcard" buttons=bOneTwoThree %}

---
## Evaluation order

However keep in mind that tags are evaluated in a certain order.
You need to use the activation tag, before you 

{% include codeDisplay.md content=cloze.activate_cloze_conflict setups="default_cloze,flashcard" buttons=bOneTwoThree %}
