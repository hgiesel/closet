import type { TagData, Internals, Registrar, Stylizer, Ellipser, ActiveBehavior, InactiveBehavior, InactiveAdapter, DataOptions, WeakFilterResult } from './types'
import type { Decider } from './deciders'

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
    backStylizer: Stylizer,
    activeEllipser: Ellipser<FlashcardPreset, string[]>,

    inactiveStylizer: Stylizer,
    contexter: Ellipser<FlashcardPreset, string[]>,
    inactiveEllipser: Ellipser<FlashcardPreset, string[]>,
}

export interface CardPreset {
    card: string
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
    backStylizer,
    activeEllipser,

    inactiveStylizer,
    contexter,
    inactiveEllipser,
}: FlashcardOptions) => (registrar: Registrar<FlashcardPreset>) => {
    const internalFilter = `${tagname}:internal`

    const flashcardRecipe = sumFour(
        simpleRecipe(inactiveAdapter(frontInactiveBehavior)(inactiveStylizer, contexter, inactiveEllipser)),
        simpleRecipe(frontActiveBehavior(frontStylizer, activeEllipser)),
        simpleRecipe(inactiveAdapter(backInactiveBehavior)(inactiveStylizer, contexter, inactiveEllipser)),
        simpleRecipe(backActiveBehavior(backStylizer, activeEllipser)),
        isActive,
        isBack,
    )

    flashcardRecipe({ tagname: internalFilter })(registrar)

    const flashcardFilter = (tag: TagData, inter: Internals<FlashcardPreset>) => {
        return  inter.filters.get(internalFilter)(tag, inter)
    }

    registrar.register(tagname, flashcardFilter, dataOptions)
}

export const choose = <U extends object>(choice: (x: Ellipser<FlashcardPreset, string[]>, y: Ellipser<FlashcardPreset, string[]>) => Ellipser<FlashcardPreset, string[]>): InactiveBehavior<FlashcardPreset, FlashcardPreset> => (
    stylizer: Stylizer,
    contexter: Ellipser<FlashcardPreset, string[]>,
    ellipser: Ellipser<FlashcardPreset, string[]>,
) => (tag: TagData, internals: Internals<U>): WeakFilterResult => {
    const result = choice(contexter, ellipser)(tag, internals)

    return Array.isArray(result)
        ? stylizer.stylize(result)
        : result
}

export const ellipsis = () => ['[...]']
