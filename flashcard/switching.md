---
layout: doc
title: Switching between subtypes
nav_order: 3
permalink: flashcard/switching
parent: Flashcard Types
---

{% assign b='Frontside, q, {"side": "front"}, true; Backside, a, {"side": "back"}, true' %}
{% assign bOneTwo='Frontside 1, q1, {side: "front",card: "c1"}, true; Backside 1, a1, {side: "back",card: "c1"}, true; Frontside 2, q2, {side: "front",card: "c2"}, true; Backside 2, a2, {side: "back",card: "c2"}, true' %}
{% assign bOneTwoThree='F1, q1, {side: "front",card: "c1"}, true; B1, a1, {side: "back",card: "c1"}, true; F2, q2, {side: "front",card: "c2"}, true; B2, a2, {side: "back",card: "c2"}, true; F3, q3, {side: "front",card: "c3"}, true; B3, a3, {side: "back",card: "c3"}, true' %}
{% assign bSix='F1, q1, {side: "front",card: "c1"}; B1, a1, {side: "back",card: "c1"}; F2, q2, {side: "front",card: "c2"}; B2, a2, {side: "back",card: "c2"}; F3, q3, {side: "front",card: "c3"}; B3, a3, {side: "back",card: "c3"}; F4, q4, {side: "front",card: "c4"}; B4, a4, {side: "back",card: "c4"}; F5, q5, {side: "front",card: "c5"}; B5, a5, {side: "back",card: "c5"}; F6, q6, {side: "front",card: "c6"}; B6, a6, {side: "back",card: "c6"}' %}

{% assign cloze = site.data.snippets.cloze %}
{% assign flashcard = site.data.snippets.flashcard %}
{% assign setups = site.data.setups %}

{% include toc-doc.md %}

---
## Switching to showing tags

This can be used to show context around clozes

{% include codeDisplay.md content=flashcard.around_ctxt setups="default_cloze,flashcard" buttons=bSix %}
