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
## Reveal hidden clozes on click

this is a test

{% include codeDisplay.md content=cloze.activate_cloze_with_occur filterManager=setups.click_to_reveal_cloze buttons=bOneTwoThree %}

foobar meh
