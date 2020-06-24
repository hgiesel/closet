---
layout: doc
title: Incremental Reveal
nav_order: 3
permalink: clozes/incremental-reveal
parent: Clozes
---

{% assign b='Frontside, q, {"side": "front"}, true; Backside, a, {"side": "back"}, true' %}
{% assign bOneTwo='Frontside 1, q1, {side: "front",card: "c1"}, true; Backside 1, a1, {side: "back",card: "c1"}, true; Frontside 2, q2, {side: "front",card: "c2"}, true; Backside 2, a2, {side: "back",card: "c2"}, true' %}
{% assign bOneTwoThree='F1, q1, {side: "front",card: "c1"}, true; B1, a1, {side: "back",card: "c1"}, true; F2, q2, {side: "front",card: "c2"}, true; B2, a2, {side: "back",card: "c2"}, true; F3, q3, {side: "front",card: "c3"}, true; B3, a3, {side: "back",card: "c3"}, true' %}

{% assign cloze = site.data.snippets.cloze %}
{% assign setups = site.data.setups %}

{% include toc-doc.md %}

---
## Reveal clozes on click

Using the obscuring feature, you can also create more interactive cards, which allow user input.
In this example, you have to click on each cloze, to reveal its content.
This is also dubbed _incremental reveal_, or _incremental clozes_.

{% include codeDisplay.md content=cloze.click_to_reveal setups="click_to_reveal_cloze" buttons=bOneTwoThree %}

As you can see, the `c` tag provides the effect of a typical incremental cloze.
The `cx` tag is useful for cases, where simply obscuring the text would still yield too much context.

As an alternative to separating out a single note into multiple cards, some people also like to make one large incremental cloze card.
This can be useful for cramming for a exam.

{% include codeDisplay.md content=cloze.click_to_reveal_single setups="click_to_reveal_cloze" buttons=b %}

---
## Reveal clozes on key press

Rather than using clicks, we can also utilize key presses.
The following clozes will not react to clicks, but only to key presses.
In particular, pressing `Q` will reveal one cloze, pressing `W` will reveal all clozes at once.

{% include codeDisplay.md content=cloze.click_to_reveal_single setups="keydown_to_reveal_cloze" buttons=b %}
