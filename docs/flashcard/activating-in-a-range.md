---
layout: doc
title: Activating in a range
nav_order: 2
permalink: flashcard/activating-in-a-range
parent: Flashcard Types
---

{% assign b='Frontside, q, {"side": "front"}; Backside, a, {"side": "back"}' %}
{% assign bOneTwo='Frontside 1, q1, {side: "front",card: "c1"}; Backside 1, a1, {side: "back",card: "c1"}; Frontside 2, q2, {side: "front",card: "c2"}; Backside 2, a2, {side: "back",card: "c2"}' %}
{% assign bOneTwoThree='F1, q1, {side: "front",card: "c1"}; B1, a1, {side: "back",card: "c1"}; F2, q2, {side: "front",card: "c2"}; B2, a2, {side: "back",card: "c2"}; F3, q3, {side: "front",card: "c3"}; B3, a3, {side: "back",card: "c3"}' %}
{% assign bSix='F1, q1, {side: "front",card: "c1"}; B1, a1, {side: "back",card: "c1"}; F2, q2, {side: "front",card: "c2"}; B2, a2, {side: "back",card: "c2"}; F3, q3, {side: "front",card: "c3"}; B3, a3, {side: "back",card: "c3"}; F4, q4, {side: "front",card: "c4"}; B4, a4, {side: "back",card: "c4"}; F5, q5, {side: "front",card: "c5"}; B5, a5, {side: "back",card: "c5"}; F6, q6, {side: "front",card: "c6"}; B6, a6, {side: "back",card: "c6"}' %}

{% assign cloze = site.data.snippets.cloze %}
{% assign flashcard = site.data.snippets.flashcard %}
{% assign setups = site.data.setups %}

{% include toc-doc.md %}

---
## Activating tags in a range

This is also known as _overlapping clozes_.

{% include codeDisplay.md content=flashcard.around_range setups="default_cloze,flashcard" buttons=bSix %}

It is especially popular with remembering poems.

{% include codeDisplay.md content=flashcard.top_bottom_range setups="default_cloze,flashcard" buttons=bSix %}
