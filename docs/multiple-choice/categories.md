---
layout: doc
title: Assigning categories
nav_order: 2
permalink: multiple-choice/categories
parent: Multiple Choice
---

{% assign b='Frontside, q, {"side": "front"}, true; Backside, a, {"side": "back"}, true' %}
{% assign bOneTwo='Frontside 1, q1, {side: "front",card: "c1"}, true; Backside 1, a1, {side: "back",card: "c1"}, true; Frontside 2, q2, {side: "front",card: "c2"}, true; Backside 2, a2, {side: "back",card: "c2"}, true' %}
{% assign bOneTwoThree='F1, q1, {side: "front",card: "c1"}, true; B1, a1, {side: "back",card: "c1"}, true; F2, q2, {side: "front",card: "c2"}, true; B2, a2, {side: "back",card: "c2"}, true; F3, q3, {side: "front",card: "c3"}, true; B3, a3, {side: "back",card: "c3"}, true' %}

{% assign mc = site.data.snippets.multiple_choice %}
{% assign setups = site.data.setups %}

{% include toc-doc.md %}

---
## Example of assignning categories

Here we have several names of animal species, which are rendered in different ways.

{% include codeDisplay.md content=mc.animals setups="assign_categories" buttons=bOneTwoThree %}

---
## How it works

In its essence, the multiple choice filter actually assigns categories.
These categories are stylized using a `Stylizer`.

```closet
[[tagname::value1||value2::value3::value4||value5]]
```

If `<tagname>` was a tag implementing the `multipleChoice` filter, `value1` and `value2` would belong to category 1, `value3` to category 2, and `value4` and `value5` belongs to category 3.
In multiple choice questions, the first category happens to be _correct answer_, and the second category _wrong answer_.
