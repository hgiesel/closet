---
layout: doc
title: Activating selectively
nav_order: 1
permalink: flashcard/activating-selectively
parent: Flashcard Types
---

{% include toc-doc.md %}

---
## Selectively activating tags

You can largely change which cards are considered active, using _activation_ and _deactivation_ tags.
This is especially useful when you use card sections (TODO).

{% include codeDisplay.md content=cloze.activate_cloze setups="default_cloze,flashcard" buttons=buttons.threeCards %}

### Using occurrence numbers

Using the notation `fulltag:occurence`, you can go into more detail when specifying clozes.
All tags are enumerated while they are generated, starting at `0`.
This way you can specifically choose which cloze to activate, even if they share the same name.

{% include codeDisplay.md content=cloze.activate_cloze_with_occur setups="default_cloze,flashcard" buttons=buttons.threeCards %}

---
## Evaluation order

However keep in mind that tags are evaluated in a certain order.
You need to use the activation tag, before you 

{% include codeDisplay.md content=cloze.activate_cloze_conflict setups="default_cloze,flashcard" buttons=buttons.threeCards %}
