---
layout: doc
title: Incremental Reveal
nav_order: 3
permalink: /clozes/incremental-reveal
parent: Clozes
---

{% assign b='Frontside, q, {"side": "front"}, true; Backside, a, {"side": "back"}, true' %}
{% assign bOneTwo='Frontside 1, q1, {side: "front",card: "c1"}, true; Backside 1, a1, {side: "back",card: "c1"}, true; Frontside 2, q2, {side: "front",card: "c2"}, true; Backside 2, a2, {side: "back",card: "c2"}, true' %}
{% assign bOneTwoThree='F1, q1, {side: "front",card: "c1"}, true; B1, a1, {side: "back",card: "c1"}, true; F2, q2, {side: "front",card: "c2"}, true; B2, a2, {side: "back",card: "c2"}, true; F3, q3, {side: "front",card: "c3"}, true; B3, a3, {side: "back",card: "c3"}, true' %}

{% include toc-doc.md %}

---
## Reveal hidden clozes on click

test

{% capture clickToRevealFm %}
Closet.browser.appendStyleScript(`
.sr--obscure-hint {
  filter: blur(0.25em);
}

.sr--obscure-fix::after {
  content: 'XXXXX';
  filter: blur(0.25em);
}
.sr--obscure-fix > span {
  display: none;
}`)

const wrappedClozeShow = Closet.wrappers.aftermath('clickToReveal', () => {
  const removeObscure = function(event) {
    if (event.currentTarget.classList.contains('sr--obscure-clickable')) {
      event.currentTarget.classList.remove('sr--obscure')
      event.currentTarget.classList.remove('sr--obscure-hint')
      event.currentTarget.classList.remove('sr--obscure-fix')
    }
  }

  const createRemoveObscureKd = function(keycode, uid) {
    return function(event) {
      if (event.keyCode === keycode) {
        const nextTarget = document.querySelector(`.sr--obscure.sr--obscure-kd-${uid}`)
        console.log(nextTarget)

        if (nextTarget) {
          nextTarget.classList.remove('sr--obscure')
          nextTarget.classList.remove('sr--obscure-hint')
          nextTarget.classList.remove('sr--obscure-fix')
        }
        else {
          event.currentTarget.removeEventListener('keydown', removeObscureKd)
        }
      }
    }
  }

  const createRemoveObscureKdAll = function(keycode, uid) {
    return function(event) {
      if (event.keyCode === keycode) {
        const nextTargets = document.querySelectorAll(`.sr--obscure.sr--obscure-kd-${uid}`)
        console.log(nextTargets)

        for (const nt of nextTargets) {
          nt.classList.remove('sr--obscure')
          nt.classList.remove('sr--obscure-hint')
          nt.classList.remove('sr--obscure-fix')
        }

        if (nextTargets.length === 0) {
          event.currentTarget.removeEventListener('keydown', removeObscureKdAll)
        }
      }
    }
  }

  document.querySelectorAll('.sr--obscure')
    .forEach(tag => {
      console.log('hi', tag)
      tag.addEventListener('click', removeObscure, {
        once: true,
      })
    })
  document.addEventListener('keydown', createRemoveObscureKd(88, '6'))
  document.addEventListener('keydown', createRemoveObscureKdAll(90, '5'))
}, Closet.recipes.clozeShow)

filterManager.addRecipe(wrappedClozeShow('c', {
  currentStylizer: new Closet.InnerStylizer({
    postprocess: v => `<span class="sr--obscure sr--obscure-hint sr--obscure-clickable">${v}</span>`,
  })
  
}))
{% endcapture %}

this is a test

{% include codeDisplay.md content=site.data.snippets.cloze.activate_cloze_with_occur filterManager=clickToRevealFm buttons=bOneTwoThree %}

foobar meh
