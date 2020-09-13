---
layout: doc
title: Picking values
nav_order: 3
permalink: /generation/picking
parent: Generation
---

{% include toc-doc.md %}

---
## Picking from value lists

Picking can be used to generate random values based on a set list of values.

{% include codeDisplay.md content=generation.picking setups="defining_lists,pick_eval" buttons=buttons.frontBack %}

---
## Picking unique values

You can control the picking of values and restrict it to unique values, if you provide an index.
Within the same picking index, the same value will never be picked twice.

In fact it will refuse to pick any further value, once it exhausted the values.
So make sure, you don't pick more values than there are within the list.

Notice that this makes it behave similiar to [shuffling values](/shuffling).

{% include codeDisplay.md content=generation.picking_unique setups="defining_lists,pick_eval" buttons=buttons.frontBack %}

---
## Picking using indices

As an alternative to random picking, you can also pick with an index.
The index is provided as the tag index.
When picking this way, the same value can be caught multiple times without any issue.

{% include codeDisplay.md content=generation.picking_index setups="defining_lists,pick_eval" buttons=buttons.frontBack %}

This is especially useful, if you want to specify a template, and only provide the different values.

{% include codeDisplay.md content=generation.picking_template setups="default_clozes,defining_lists,pick_eval" buttons=buttons.threeCards %}
