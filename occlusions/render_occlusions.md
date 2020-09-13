---
layout: doc
title: Render occlusions
nav_order: 2
permalink: /occlusions/render-occlusions
parent: Image Occlusions
---

{% include toc-doc.md %}

---
## Render occlusions

Occlusions can be defined by using the position of the origin (top left), and the width and height of the rectangle.

{% include codeDisplay.md content=occlusions.bones setups="occlusions" buttons=buttons.sixCards %}

Similar to clozes, there are three subtypes of occlusions:
- showing occlusions
- hiding occlusions
- revealing occlusions

{% include codeDisplay.md content=occlusions.cell setups="occlusions" buttons=buttons.threeCards %}

To be more exact, occlusions also react to the flashcard interface.
This means, they can be used with the flashcard specific commands.

{% include codeDisplay.md content=occlusions.cell_flashcard setups="occlusions,flashcard" buttons=buttons.sixCards %}
