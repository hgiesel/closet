import type { TagNode, Internals, Registrar, Recipe, Eval, InactiveBehavior, InactiveAdapter, DataOptions, WeakFilter } from '../types'

import { id, id2, constant } from '../utils'
import { sumFour } from '../sum'
import { simpleRecipe } from '../simple'

import { isActiveAll, isBackAll } from './deciders'
import { inactiveAdapterAll } from './inactiveAdapter'

export type FlashcardTemplate<T extends FlashcardPreset> = (
    f2: InactiveBehavior<T>,
    b2: InactiveBehavior<T>,
) => (
    tagname: string,
    front: WeakFilter<T>,
    back: WeakFilter<T>,
    contexter: WeakFilter<T>,
    inactive: WeakFilter<T>,
    dataOptions: Partial<DataOptions>,
) => (
    registrar: Registrar<T>
) => void

export interface CardPreset {
    cardNumber: number
    [v: string]: unknown
}

export interface SidePreset {
    side: 'front' | 'back'
    [v: string]: unknown
}

export type FlashcardPreset = CardPreset & SidePreset

export const makeFlashcardTemplate = <T extends FlashcardPreset>(
    isActive: Eval<T, boolean> = isActiveAll,
    isBack: Eval<T, boolean> = isBackAll,
    inactiveAdapter: InactiveAdapter<T> = inactiveAdapterAll,
): FlashcardTemplate<T> => (
    frontInactiveBehavior: InactiveBehavior<T>,
    backInactiveBehavior: InactiveBehavior<T>,
) => (
    tagname: string,
    front: WeakFilter<T>,
    back: WeakFilter<T>,
    contexter: WeakFilter<T>,
    inactive: WeakFilter<T>,
    dataOptions: Partial<DataOptions> = {},
) => (registrar: Registrar<T>) => {
    const internalFilter = `${tagname}:internal`

    const flashcardRecipe = sumFour(
        simpleRecipe(inactiveAdapter(frontInactiveBehavior)(contexter, inactive)),
        simpleRecipe(front),
        simpleRecipe(inactiveAdapter(backInactiveBehavior)(contexter, inactive)),
        simpleRecipe(back),
        isActive,
        isBack,
    )

    flashcardRecipe({ tagname: internalFilter })(registrar)

    const flashcardFilter = (tag: TagNode, inter: Internals<T>) => {
        return  inter.filters.getOrDefault(internalFilter)(tag, inter)
    }

    registrar.register(tagname, flashcardFilter, dataOptions)
}

export const generateFlashcardRecipes = <T extends FlashcardPreset>(
    publicApi: (front: InactiveBehavior<T>, back: InactiveBehavior<T>) => Recipe<T>
) => [
    publicApi(id, id),
    publicApi(id2, id2),
    publicApi(id2, id),
]

export const ellipsis = constant('[...]')
