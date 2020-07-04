---
layout: doc
title: Creating multiple choice
nav_order: 1
permalink: multiple-choice/creating
parent: Multiple Choice
---

{% assign b='Frontside, q, {"side": "front"}; Backside, a, {"side": "back"}' %}
{% assign bOneTwo='Frontside 1, q1, {side: "front",card: "c1"}; Backside 1, a1, {side: "back",card: "c1"}; Frontside 2, q2, {side: "front",card: "c2"}; Backside 2, a2, {side: "back",card: "c2"}' %}
{% assign bOneTwoThree='F1, q1, {side: "front",card: "c1"}; B1, a1, {side: "back",card: "c1"}; F2, q2, {side: "front",card: "c2"}; B2, a2, {side: "back",card: "c2"}; F3, q3, {side: "front",card: "c3"}; B3, a3, {side: "back",card: "c3"}' %}

{% assign mc = site.data.snippets.multiple_choice %}
{% assign setups = site.data.setups %}

{% include toc-doc.md %}

---
## Creating multiple choice

{% include codeDisplay.md content=mc.simple setups="default_multiple_choice" buttons=b %}

---
## Graphical effects

{% include codeDisplay.md content=mc.simple setups="fancy_multiple_choice" buttons=b %}
