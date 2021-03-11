filterManager.install(
    closet.recipes.shuffle({ tagname: 'mix' }),
    closet.recipes.order({ tagname: 'ord' }),

    closet.flashcard.recipes.cloze({
        tagname: 'c',
        defaultBehavior: closet.flashcard.behaviors.Show,
    }),
    closet.flashcard.recipes.multipleChoice({
        tagname: 'mc',
        defaultBehavior: closet.flashcard.behaviors.Show,
    }),
    closet.flashcard.recipes.sort({
        tagname: 'sort',
        defaultBehavior: closet.flashcard.behaviors.Show,
    }),

    closet.browser.recipes.rect({
        tagname: 'rect',
        defaultBehavior: closet.flashcard.behaviors.Show,
    }),
)
