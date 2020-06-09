---
layout: doc
title: Blanking and Obscuring
nav_order: 2
permalink: clozes/blanking-obscuring
parent: Clozes
---

{% assign b='Frontside, q, {"side": "front"}, true; Backside, a, {"side": "back"}, true' %}
{% assign bOneTwo='Frontside 1, q1, {side: "front",card: "c1"}, true; Backside 1, a1, {side: "back",card: "c1"}, true; Frontside 2, q2, {side: "front",card: "c2"}, true; Backside 2, a2, {side: "back",card: "c2"}, true' %}
{% assign bOneTwoThree='F1, q1, {side: "front",card: "c1"}, true; B1, a1, {side: "back",card: "c1"}, true; F2, q2, {side: "front",card: "c2"}, true; B2, a2, {side: "back",card: "c2"}, true; F3, q3, {side: "front",card: "c3"}, true; B3, a3, {side: "back",card: "c3"}, true' %}

{% assign cloze = site.data.snippets.cloze %}
{% assign setups = site.data.setups %}

{% include toc-doc.md %}

---
## The Ellipsis Maker

By default, the cloze filter will use the second provided value as a hint.
However this behavior is easily modifiable by overwriting the `ellipsisMaker`.

This function is used in different situations, depending on the cloze subtype:
* _showing clozes_ use it for _active front_
* _hiding clozes_ use it for _active front_ and any _inactive_
* _revealing clozes_ use it for any _front_

If any of the terms _active_, _inactive_, _front_, _back_ confuse, see [here](/clozes#test-and-answer-context).

In the following, we outline two possible ways to adapt the ellipsis maker.

---
## Blanking

One possible way would be to show the answer all blanked out by underscore symbols `_`.

{% include codeDisplay.md content=cloze.hiding_cloze filterManager=setups.blanking_cloze buttons=bOneTwoThree %}

Notice how the commas are left out.
Together with the blanks, this lets us know that the flash card wants us to name _three_ catecholamines.
This might have otherwise been done with a hint.

### International support

Closet has a built-in [regular expression](https://en.wikipedia.org/wiki/Regular_expression), which specifically targets _alphanumeric characters_, no matter the language.

{% include codeDisplay.md content=cloze.hiding_cloze_symbols filterManager=setups.blanking_cloze buttons=bOneTwoThree %}

Depending on the context you might want to hide symbols as well.
In this case, you have to change the used regular expression.

---
## Obscuring

Another option is to obscure the solution by bluring the answer text.

{% include codeDisplay.md content=cloze.hiding_cloze filterManager=setups.obscuring_cloze buttons=bOneTwoThree %}

Note how we changed the highlight color: Seeing blurred blue on a black background would be hard to see.
