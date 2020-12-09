filterManager.install(
    closet.recipes.shuffle({ tagname: 'mix' }),
    closet.recipes.order({ tagname: 'ord' }),

    closet.recipes.cloze.hide({ tagname: 'c' }),
    closet.recipes.cloze.show({ tagname: 'cs' }),
    closet.recipes.cloze.reveal({ tagname: 'cr' }),

    closet.recipes.multipleChoice.hide({ tagname: 'mc' }),
    closet.recipes.multipleChoice.show({ tagname: 'mcs' }),
    closet.recipes.multipleChoice.reveal({ tagname: 'mcr' }),

    closet.browser.recipes.rect.hide({ tagname: 'rect' }),
    closet.browser.recipes.rect.show({ tagname: 'rects' }),
    closet.browser.recipes.rect.reveal({ tagname: 'rectr' }),
)
