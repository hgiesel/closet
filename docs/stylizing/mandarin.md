---
layout: doc
title: Mandarin tone stylizing
nav_order: 2
permalink: stylizing/mandarin
parent: Stylizing
---

{% assign b = "Render, render, {}, false" %}
{% assign bOneTwo ='Frontside, q, {"side": "front"}, true; Backside, a, {"side": "back"}, true' %}

{% assign stylizing = site.data.snippets.stylizing %}
{% assign setups = site.data.setups %}

{% include toc-doc.md %}

---
## Ordering

{% include codeDisplay.md content=stylizing.mandarin setups="mandarin_support" buttons=bOneTwo %}
