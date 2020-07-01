import type { TagData, Internals, Registrar, Stylizer, Ellipser, ActiveBehavior, InactiveBehavior, DataOptions } from './types'

import { fourWayWrap } from './nway'
import { isBack, isActive } from './deciders'
import { simpleRecipe } from './simple'

export interface FlashcardPreset {
    card: string
    side: 'front' | 'back'
}

export const flashcardTemplate = (
    frontActiveBehavior: ActiveBehavior<FlashcardPreset, FlashcardPreset>,
    backActiveBehavior: ActiveBehavior<FlashcardPreset, FlashcardPreset>,
    dataOptions: Partial<DataOptions> = {},
) => (
    frontInactiveBehavior: InactiveBehavior<FlashcardPreset, FlashcardPreset>,
    backInactiveBehavior: InactiveBehavior<FlashcardPreset, FlashcardPreset>,
) => ({
    tagname,
    switcherKeyword = 'switch',
    activateKeyword = 'activate',

    frontStylizer,
    backStylizer,

    contexter,
    activeEllipser,
    inactiveEllipser,
}: {
    tagname: string,
    switcherKeyword: string,
    activateKeyword: string,

    frontStylizer: Stylizer,
    backStylizer: Stylizer,

    contexter: Ellipser<FlashcardPreset>,
    activeEllipser: Ellipser<FlashcardPreset>,
    inactiveEllipser: Ellipser<FlashcardPreset>,
}) => (registrar: Registrar<FlashcardPreset>) => {
    const internalFilter = `${tagname}:internal`
    let activeOverwrite = false

    const isActiveWithOverwrite = (t: TagData, inter: Internals<FlashcardPreset>) => isActive(t, inter) || activeOverwrite

    const flashcardRecipe = fourWayWrap(
        isActiveWithOverwrite,
        isBack,
        simpleRecipe(frontInactiveBehavior(contexter, inactiveEllipser)),
        simpleRecipe(frontActiveBehavior(frontStylizer, activeEllipser)),
        simpleRecipe(backInactiveBehavior(contexter, inactiveEllipser)),
        simpleRecipe(backActiveBehavior(backStylizer, activeEllipser)),
    )

    flashcardRecipe({ tagname: internalFilter })(registrar)

    const flashcardFilter = (tag: TagData, inter: Internals<FlashcardPreset>) => {
        const theFilter = inter.cache.get(`${tagname}:${switcherKeyword}`, {
            get: (_k: string, _n: number | null, _o: number) => internalFilter,
        }).get(tag.key, tag.num, tag.fullOccur)

        activeOverwrite = inter.cache.get(`${tagname}:${activateKeyword}`, {
            get: (_k: string, _n: number | null, _o: number) => false,
        }).get(tag.key, tag.num, tag.fullOccur)

        return  inter.filters.get(theFilter)(tag, inter)
    }

    registrar.register(tagname, flashcardFilter, dataOptions)
}
