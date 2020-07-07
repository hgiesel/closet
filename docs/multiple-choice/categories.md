---
layout: doc
title: Assigning categories
nav_order: 2
permalink: multiple-choice/categories
parent: Multiple Choice
---

{% include toc-doc.md %}

---
## Example of assignning categories

Here we have several names of animal species, which are rendered in different ways.

{% include codeDisplay.md content=mc.animals setups="assign_categories" buttons=buttons.threeCards %}

---
## How it works

In its essence, the multiple choice filter actually assigns categories.
These categories are stylized using a `Stylizer`.

```closet
[[tagname::value1||value2::value3::value4||value5]]
```

If `<tagname>` was a tag implementing the `multipleChoice` filter, `value1` and `value2` would belong to category 1, `value3` to category 2, and `value4` and `value5` belongs to category 3.
In multiple choice questions, the first category happens to be _correct answer_, and the second category _wrong answer_.
