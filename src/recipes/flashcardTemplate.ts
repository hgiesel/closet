import type { TagData, Internals, Registrar, Recipe, Stylizer, Ellipser, ActiveBehavior, InactiveBehavior, InactiveAdapter, DataOptions, WeakFilterResult } from './types'
import type { Decider } from './deciders'

import { id, id2 } from './utils'
import { isActiveAll, isBackAll } from './deciders'
import { inactiveAdapterAll } from './inactiveAdapter'
import { sumFour } from './sum'
import { simpleRecipe } from './simple'

export type FlashcardTemplate = (
    f2: InactiveBehavior<FlashcardPreset, FlashcardPreset>,
    b2: InactiveBehavior<FlashcardPreset,FlashcardPreset>,
) => (
    f: ActiveBehavior<FlashcardPreset,FlashcardPreset>,
    b: ActiveBehavior<FlashcardPreset,FlashcardPreset>,
    d: Partial<DataOptions>,
) => (
    opt: FlashcardOptions
) => (
    registrar: Registrar<FlashcardPreset>
) => void

export interface FlashcardOptions {
    tagname: string,

    frontStylizer: Stylizer,
    frontEllipser: Ellipser<FlashcardPreset, string[]>,

    backStylizer: Stylizer,
    backEllipser: Ellipser<FlashcardPreset, string[]>,

    inactiveStylizer: Stylizer,
    contexter: Ellipser<FlashcardPreset, string[]>,
    inactiveEllipser: Ellipser<FlashcardPreset, string[]>,
}

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
    frontActiveBehavior: ActiveBehavior<FlashcardPreset, FlashcardPreset>,
    backActiveBehavior: ActiveBehavior<FlashcardPreset, FlashcardPreset>,
    dataOptions: Partial<DataOptions> = {},
) => ({
    tagname,

    frontStylizer,
    frontEllipser,

    backStylizer,
    backEllipser,

    inactiveStylizer,
    contexter,
    inactiveEllipser,
}: FlashcardOptions) => (registrar: Registrar<FlashcardPreset>) => {
    const internalFilter = `${tagname}:internal`

    const flashcardRecipe = sumFour(
        simpleRecipe(inactiveAdapter(frontInactiveBehavior)(inactiveStylizer, contexter, inactiveEllipser)),
        simpleRecipe(frontActiveBehavior(frontStylizer, frontEllipser)),
        simpleRecipe(inactiveAdapter(backInactiveBehavior)(inactiveStylizer, contexter, inactiveEllipser)),
        simpleRecipe(backActiveBehavior(backStylizer, backEllipser)),
        isActive,
        isBack,
    )

    flashcardRecipe({ tagname: internalFilter })(registrar)

    const flashcardFilter = (tag: TagData, inter: Internals<FlashcardPreset>) => {
        return  inter.filters.get(internalFilter)(tag, inter)
    }

    registrar.register(tagname, flashcardFilter, dataOptions)
}

const choose = <U extends object>(choice: (x: Ellipser<FlashcardPreset, string[]>, y: Ellipser<FlashcardPreset, string[]>) => Ellipser<FlashcardPreset, string[]>): InactiveBehavior<FlashcardPreset, FlashcardPreset> => (
    stylizer: Stylizer,
    contexter: Ellipser<FlashcardPreset, string[]>,
    ellipser: Ellipser<FlashcardPreset, string[]>,
) => (tag: TagData, internals: Internals<U>): WeakFilterResult => {
    const result = choice(contexter, ellipser)(tag, internals)

    return Array.isArray(result)
        ? stylizer.stylize(result)
        : result
}

export const generateFlashcardRecipes = (publicApi: (front: InactiveBehavior<FlashcardPreset, FlashcardPreset>, back: InactiveBehavior<FlashcardPreset, FlashcardPreset>) => Recipe<FlashcardPreset>) => {
    const chooseFirst = choose(id)
    const chooseSecond = choose(id2)
    return [
        publicApi(chooseFirst, chooseFirst),
        publicApi(chooseSecond, chooseSecond),
        publicApi(chooseSecond, chooseFirst),
    ]
}

export const ellipsis = () => ['[...]']

export const directApply: ActiveBehavior<FlashcardPreset, FlashcardPreset> = (
    stylizer: Stylizer,
    ellipser: Ellipser<FlashcardPreset, string[]>,
) => (tag: TagData, internals: Internals<FlashcardPreset>) => {
    return stylizer.stylize(ellipser(tag, internals))
}
