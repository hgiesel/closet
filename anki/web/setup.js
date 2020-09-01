filterManager.install(
    closet.recipes.shuffle({ tagname: 'mix' }),
    closet.recipes.order({ tagname: 'ord' }),

    closet.recipes.cloze.show({ tagname: 'c' }),
    closet.recipes.cloze.reveal({ tagname: 'cr' }),
    closet.recipes.cloze.hide({ tagname: 'ch' }),

    closet.recipes.multipleChoice.show({ tagname: 'mc' }),
    closet.recipes.multipleChoice.reveal({ tagname: 'mcr' }),
    closet.recipes.multipleChoice.hide({ tagname: 'mch' }),

    closet.browser.recipes.rect.show({ tagname: 'rect' }),
    closet.browser.recipes.rect.reveal({ tagname: 'rectr' }),
    closet.browser.recipes.rect.hide({ tagname: 'recth' }),
)
