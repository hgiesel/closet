import type { Un, TagNode, Internals, Eval, WeakSeparator, Recipe, WeakFilter, InactiveBehavior } from '../types'
import type { StyleList } from '../styleList'

import type { FlashcardTemplate, FlashcardPreset } from './flashcardTemplate'

import { makeFlashcardTemplate, generateFlashcardRecipes } from './flashcardTemplate'
import { listStylize } from '../styleList'
import { Stylizer } from '../stylizer'
import { constant } from '../utils'

const inactive = constant('<span class="closet-cloze is-inactive"><span class="closet-cloze__ellipsis"></span></span>')

const active = (side: string) => (s: string) => `<span class="closet-cloze is-active is-${side}">${s}</span>`
const activeFront: Stylizer = Stylizer.make({ processor: active('front') })
const activeBack = Stylizer.make({ processor: active('back') })

const hint = <T extends Un>(
    tag: TagNode,
    _internals: Internals<T>,
) => {
    return [`<span class="closet-cloze__hint">${tag.values[1] ?? ""}</span>`]
}

const answer = (tag: TagNode) => `<span class="closet-cloze__answer">${tag.values[0]}</span>`

const answerBubbleReady = <T extends Un>(tag: TagNode, { ready }: Internals<T>) => ({
    ready: ready,
    result: answer(tag),
})

const answerAsList = (tag: TagNode) => [answer(tag)]

const clozePublicApi = <T extends FlashcardPreset>(
    frontInactive: InactiveBehavior<T>,
    backInactive: InactiveBehavior<T>,
): Recipe<T> => (options: {
    tagname?: string,

    frontStylizer?: Stylizer,
    frontEllipser?: Eval<T, StyleList>,

    backStylizer?: Stylizer,
    backEllipser?: Eval<T, StyleList>,

    inactiveEllipser?: WeakFilter<T>,

    separator?: WeakSeparator,
    flashcardTemplate?: FlashcardTemplate<T>,
} = {}) => {
    const {
        tagname = 'c',

        inactiveEllipser = inactive,

        frontStylizer = activeFront,
        frontEllipser = hint,

        backStylizer = activeBack,
        backEllipser = answerAsList,

        separator = { sep: '::', max: 2 },
        flashcardTemplate = makeFlashcardTemplate(),
    } = options

    const front = listStylize(frontStylizer, frontEllipser)
    const back = listStylize(backStylizer, backEllipser)

    const clozeSeparators = { separators: [separator] }
    const clozeRecipe = flashcardTemplate(frontInactive, backInactive)

    return clozeRecipe(tagname, front, back, answerBubbleReady, inactiveEllipser, clozeSeparators)
}

export const clozeRecipes = generateFlashcardRecipes(clozePublicApi)
