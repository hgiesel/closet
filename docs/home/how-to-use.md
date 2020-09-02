---
layout: doc
title: How to use the website
nav_order: 3
permalink: how-to-use
parent: Home
---

{% include header-doc.md %}

The site displays all kinds of _effects_ you can apply, when you use Closet.
This effects are things you'd want to apply to your flashcards.
These include:
- [Shuffling](../shuffling) list items
- Creating [cloze deletions](../clozes)
- Make flashcards, which [ask you to correctly sort a shuffled sequence](../shuffling/shuffle_quest)
- Create [multiple Choice questions](../multiple-choice)
- Create [image occlusions](../occlusions)

---

There are two parts to this website:
- the **effect previews**
- the **tester**

---
## Effect Previews

The effect previews contain various code displays, like the one below:

{% include codeDisplay.md content=home.intro_example setups="default_cloze" buttons=buttons.frontBack %}

If you use [Closet For Anki](https://ankiweb.net/shared/info/272311064), there are the following things to take in account:
- The **lower part** of the display shows the text you'd fill into your **note fields**
- The **upper part** is what you expect as output on the **displayed card** in the reviewer (or previewer)

Here you can see the same example, but filled into the Anki windows:

<div style="display: flex; flex-wrap: wrap; position: relative;">
  <img alt="Closet logo" src="/assets/images/editcurrent.png" style="flex: 40%; width: 40%; padding: 5px;"/>
  <img alt="Closet logo" src="/assets/images/reviewer.png" style="flex: 40%; width: 40%; padding: 5px;"/>
</div>

- The **buttons** signify different configurations or environments:
  - For Anki this means whether it is the _front_, or the _back_ of the card
  - Additionaly they might designate the [card number](#card-numbers)
- The **setup** button will give you the JavaScript code, you'd need to configure Closet to transform the input text in the lower part to the output text in the upper part
- Clicking **tester** takes you to the other part of this website, the [tester](../tester)
  - The tester will be preconfigured with the setup of the *effect preview* you came from
  - It let's you change the text, and play around with other setups or configurations

---
## Card Numbers

Closet inherently supports the notion of different _card numbers_:
- The effect previews will typically have buttons with labels such as _Front 1_, _Front 2_, _Back 1_, or simply _F1_, _F2_, _B1_, and so on
- These numbers imply the *card number*
- In [Closet For Anki](https://ankiweb.net/shared/info/272311064) itself, Closet infers the card number by looking at the _card name_:

![card_names](../assets/images/anki-fields.png)

In this example, _Card 1_ would be considered to have card number 1, _Card 2_ would have card number 2, and _Extra_ would have an undefined card number.

---
## Take the functionality to Anki

TODO
