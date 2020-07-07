import type { TagData, Internals, Registrar, Recipe, Stylizer, Eval, InactiveBehavior, InactiveAdapter, DataOptions, WeakFilter, WeakFilterResult } from './types'
import type { Decider } from './deciders'

import { id, id2, constant } from './utils'
import { isActiveAll, isBackAll } from './deciders'
import { inactiveAdapterAll } from './inactiveAdapter'
import { sumFour } from './sum'
import { simpleRecipe } from './simple'

export type FlashcardTemplate = (
    f2: InactiveBehavior<FlashcardPreset, FlashcardPreset>,
    b2: InactiveBehavior<FlashcardPreset,FlashcardPreset>,
) => (
    tagname: string,
    front: WeakFilter<FlashcardPreset>,
    back: WeakFilter<FlashcardPreset>,
    contexter: WeakFilter<FlashcardPreset>,
    inactive: WeakFilter<FlashcardPreset>,
    dataOptions: Partial<DataOptions>,
) => (
    registrar: Registrar<FlashcardPreset>
) => void

export interface CardPreset {
    cardNumber: number
}

export interface SidePreset {
    side: 'front' | 'back'
}

export type FlashcardPreset = CardPreset & SidePreset

export const makeFlashcardTemplate = (
    isActive: Decider<FlashcardPreset> = isActiveAll,
    isBack: Decider<FlashcardPreset> = isBackAll,
    inactiveAdapter: InactiveAdapter<FlashcardPreset, FlashcardPreset> = inactiveAdapterAll,
): FlashcardTemplate => (
    frontInactiveBehavior: InactiveBehavior<FlashcardPreset, FlashcardPreset>,
    backInactiveBehavior: InactiveBehavior<FlashcardPreset, FlashcardPreset>,
) => (
    tagname: string,
    front: WeakFilter<FlashcardPreset>,
    back: WeakFilter<FlashcardPreset>,
    contexter: WeakFilter<FlashcardPreset>,
    inactive: WeakFilter<FlashcardPreset>,
    dataOptions: Partial<DataOptions> = {},
) => (registrar: Registrar<FlashcardPreset>) => {
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

    const flashcardFilter = (tag: TagData, inter: Internals<FlashcardPreset>) => {
        return  inter.filters.get(internalFilter)(tag, inter)
    }

    registrar.register(tagname, flashcardFilter, dataOptions)
}

const choose = <U extends object>(choice: <T>(x: T, y: T) => T): InactiveBehavior<FlashcardPreset, FlashcardPreset> => (
    contexter: WeakFilter<FlashcardPreset>,
    ellipser: WeakFilter<FlashcardPreset>,
) => (tag: TagData, internals: Internals<U>): WeakFilterResult => choice(contexter, ellipser)(tag, internals)

export const generateFlashcardRecipes = (publicApi: (front: InactiveBehavior<FlashcardPreset, FlashcardPreset>, back: InactiveBehavior<FlashcardPreset, FlashcardPreset>) => Recipe<FlashcardPreset>) => {
    const chooseFirst = choose(id)
    const chooseSecond = choose(id2)

    return [
        publicApi(chooseFirst, chooseFirst),
        publicApi(chooseSecond, chooseSecond),
        publicApi(chooseSecond, chooseFirst),
    ]
}

export const toListStylize = (
    stylizer: Stylizer,
    toList: Eval<FlashcardPreset, string[]>,
): WeakFilter<FlashcardPreset> => (tag: TagData, internals: Internals<FlashcardPreset>) => {
    return stylizer.stylize(toList(tag, internals))
}

export const ellipsis = constant('[...]')
