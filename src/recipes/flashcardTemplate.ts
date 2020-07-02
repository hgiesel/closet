import type { TagData, Internals, Registrar, Stylizer, Ellipser, ActiveBehavior, InactiveBehavior, InactiveAdapter, DataOptions } from './types'
import type { Decider } from './deciders'

import { isActiveAll, isBackAll } from './deciders'
import { fourWayWrap } from './nway'
import { simpleRecipe } from './simple'
import { id } from './utils'

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

    contexter: Ellipser<FlashcardPreset>,
    activeEllipser: Ellipser<FlashcardPreset>,
    inactiveEllipser: Ellipser<FlashcardPreset>,
}

export interface FlashcardPreset {
    card: string
    side: 'front' | 'back'
}

export const makeFlashcardTemplate = (
    isActive: Decider<FlashcardPreset> = isActiveAll,
    isBack: Decider<FlashcardPreset> = isBackAll,
    inactiveAdapter: InactiveAdapter<FlashcardPreset, FlashcardPreset> = id,
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

    contexter,
    activeEllipser,
    inactiveEllipser,
}: FlashcardOptions) => (registrar: Registrar<FlashcardPreset>) => {
    const internalFilter = `${tagname}:internal`

    const flashcardRecipe = fourWayWrap(
        isActive,
        isBack,
        simpleRecipe(inactiveAdapter(frontInactiveBehavior)(contexter, inactiveEllipser)),
        simpleRecipe(frontActiveBehavior(frontStylizer, activeEllipser)),
        simpleRecipe(inactiveAdapter(backInactiveBehavior)(contexter, inactiveEllipser)),
        simpleRecipe(backActiveBehavior(backStylizer, activeEllipser)),
    )

    flashcardRecipe({ tagname: internalFilter })(registrar)

    const flashcardFilter = (tag: TagData, inter: Internals<FlashcardPreset>) => {
        return  inter.filters.get(internalFilter)(tag, inter)
    }

    registrar.register(tagname, flashcardFilter, dataOptions)
}
