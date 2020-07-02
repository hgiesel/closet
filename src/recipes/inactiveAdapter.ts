import type { InactiveBehavior, Ellipser, TagData, Internals } from './types'
import type { CardPreset } from './flashcardTemplate'

import { StoreGetter, constantGet } from './valueStore'

export const inactiveAdapter = <T extends object>(
    behavior: InactiveBehavior<T, CardPreset>,
) => (
    contexter: Ellipser<T>,
    ellipser: Ellipser<T>,
) => (
    tag: TagData,
    internals: Internals<T & CardPreset>,
) => behavior(contexter, ellipser)(tag, internals)

export const inactiveAdapterOverwritten = <T extends object>(
    behavior: InactiveBehavior<T, CardPreset>,
) => (
    contexter: Ellipser<T>,
    ellipser: Ellipser<T>,
) => (
    tag: TagData,
    internals: Internals<T & CardPreset>,
) => {
    const showKeyword = 'flashcardShow'
    const hideKeyword = 'flashcardHide'

    const constantFalse = constantGet(false)

    const showOverwrite = internals.cache.get<StoreGetter<boolean>>(showKeyword, constantFalse)
        .get(tag.key, tag.num, tag.fullOccur)

    if (showOverwrite) {
        return contexter(tag, internals)
    }

    const hideOverwrite = internals.cache.get<StoreGetter<boolean>>(hideKeyword, constantFalse)
        .get(tag.key, tag.num, tag.fullOccur)

    if (hideOverwrite) {
        return ellipser(tag, internals)
    }

    return inactiveAdapter(behavior)(contexter, ellipser)(tag, internals)
}

export const inactiveAdapterAll = inactiveAdapterOverwritten

// export const isActiveGetRange = (tag: TagData, internals: Internals<CardPreset>): boolean => {
//     const bottomRangeKeyword = 'bottom'
//     const topRangeKeyword = 'top'

//     const bottomRange = internals.cache.get<StoreGetter<number>>(
//         bottomRangeKeyword,
//         defaultGet(0),
//     ).get(tag.key, tag.num, tag.fullOccur)

//     const topRange = internals.cache.get<StoreGetter<number>>(
//         topRangeKeyword,
//         defaultGet(0),
//     ).get(tag.key, tag.num, tag.fullOccur)

//     return isActiveWithinRange(bottomRange, topRange)(tag, internals)
// }

// export const isActiveOverwritten = (tag: TagData, internals: Internals<CardPreset>): boolean => {
//     const activeKeyword = 'active'

//     const activeOverwrite = internals.cache.get<StoreGetter<boolean>>(
//         activeKeyword,
//         defaultGet(false),
//     ).get(tag.key, tag.num, tag.fullOccur)

//     return activeOverwrite
// }
