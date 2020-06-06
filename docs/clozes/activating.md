---
layout: doc
title: Activating Clozes
nav_order: 2
permalink: /clozes/activating
parent: Clozes
---

{% assign b='Frontside, q, {"side": "front"}, true; Backside, a, {"side": "back"}, true' %}
{% assign bOneTwo='Frontside 1, q1, {side: "front",card: "c1"}, true; Backside 1, a1, {side: "back",card: "c1"}, true; Frontside 2, q2, {side: "front",card: "c2"}, true; Backside 2, a2, {side: "back",card: "c2"}, true' %}
{% assign bOneTwoThree='F1, q1, {side: "front",card: "c1"}, true; B1, a1, {side: "back",card: "c1"}, true; F2, q2, {side: "front",card: "c2"}, true; B2, a2, {side: "back",card: "c2"}, true; F3, q3, {side: "front",card: "c3"}, true; B3, a3, {side: "back",card: "c3"}, true' %}

{% include toc-doc.md %}

## Why send messages?

A message will change the behavior of the cloze dynamically.

{% capture defaultCloze %}
const fm = new Closet.FilterManager(preset)
fm.addRecipe(Closet.recipes.clozeShow())
fm.addRecipe(Closet.recipes.activate())
fm.addRecipe(Closet.recipes.deactivate())
fm.addRecipe(Closet.recipes.toggle())

return fm
{% endcapture %}

{% include codeDisplay.html content=site.data.snippets.cloze.activate_cloze filterManager=defaultCloze buttons=bOneTwoThree %}
