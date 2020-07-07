---
layout: doc
title: Blanking and Obscuring
nav_order: 2
permalink: clozes/blanking-obscuring
parent: Clozes
---

{% include toc-doc.md %}

---
## Blanking

One possible way would be to show the answer all blanked out by underscore symbols `_`.

{% include codeDisplay.md content=cloze.hiding_cloze setups="blanking_cloze" buttons=buttons.threeCards %}

Notice how the commas are left out.
Together with the blanks, this lets us know that the flash card wants us to name _three_ catecholamines.
This might have otherwise been done with a hint.

### International support

Closet has a built-in [regular expression](https://en.wikipedia.org/wiki/Regular_expression), which specifically targets _alphanumeric characters_, no matter the language.

{% include codeDisplay.md content=cloze.hiding_cloze_symbols setups="blanking_cloze" buttons=buttons.threeCards %}

Depending on the context you might want to hide symbols as well.
In this case, you have to change the used regular expression.

---
## Obscuring

Another option is to obscure the solution by bluring the answer text.

{% include codeDisplay.md content=cloze.hiding_cloze setups="obscuring_cloze" buttons=buttons.threeCards %}

Note how we changed the highlight color: Seeing blurred blue on a black background would be hard to see.

---
## Ellipsers

Both of these behaviors was implemented by providing custom ellipsers.

An ellipser is a function that outputs a string.
There are two ellipsers: the _active ellipser_, and the _inactive ellipser_.

The *active ellipser* is used by all cloze subtypes to render _active front_ clozes.
By default is shows you the [hint](creating#hints) (a second provided value), or "[...]", in case you did not provide hint.

The *inactive ellipser* has a default output of "[...]".
It is used in the following cases:
* *revealing clozes* use it for _inactive front_ clozes
* *hiding clozes* use it for any _inactive_ clozes

If any of the terms _active_, _inactive_, _front_, _back_ confuse, see [here](/clozes#test-and-answer-context).
