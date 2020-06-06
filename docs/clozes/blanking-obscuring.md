---
layout: doc
title: Blanking and Obscuring
nav_order: 2
permalink: /clozes/blanking-obscuring
parent: Clozes
---

{% assign b='Frontside, q, {"side": "front"}, true; Backside, a, {"side": "back"}, true' %}
{% assign bOneTwo='Frontside 1, q1, {side: "front",card: "c1"}, true; Backside 1, a1, {side: "back",card: "c1"}, true; Frontside 2, q2, {side: "front",card: "c2"}, true; Backside 2, a2, {side: "back",card: "c2"}, true' %}
{% assign bOneTwoThree='F1, q1, {side: "front",card: "c1"}, true; B1, a1, {side: "back",card: "c1"}, true; F2, q2, {side: "front",card: "c2"}, true; B2, a2, {side: "back",card: "c2"}, true; F3, q3, {side: "front",card: "c3"}, true; B3, a3, {side: "back",card: "c3"}, true' %}

{% include toc-doc.md %}

## Selectively activating tags

A message will change the behavior of the cloze dynamically.

{% capture blankingFm %}
const ellipsisMaker = function({ values }, _i, isCurrent) {
  return isCurrent
    ? values[0].join('||').replace(Closet.unicodeLetterPattern, '_')
    : '[...]'
}

filterManager.addRecipe(Closet.recipes.clozeShow({
  ellipsisMaker: ellipsisMaker,
}))
{% endcapture %}

{% include codeDisplay.md content=site.data.snippets.cloze.activate_cloze filterManager=blankingFm buttons=bOneTwoThree %}

## Evaluation order

However keep in mind that tags are evaluated in a certain order.
You need to use the activation tag, before you 

{% include codeDisplay.md content=site.data.snippets.cloze.activate_cloze_with_occur filterManager=defaultCloze buttons=bOneTwoThree %}
