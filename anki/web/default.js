filterManager.install(
    closet.recipes.shuffle({ tagname: 'mix' }),
    closet.recipes.order({ tagname: 'ord' }),

    closet.recipes.flashcard.cloze({
        tagname: 'c',
        defaultBehavior: closet.recipes.flashcard.behaviors.Show,
    }),
    closet.recipes.flashcard.multipleChoice({
        tagname: 'mc',
        defaultBehavior: closet.recipes.flashcard.behaviors.Show,
    }),
    closet.recipes.browser.rect({
        tagname: 'rect',
        defaultBehavior: closet.recipes.flashcard.behaviors.Show,
    }),
)
