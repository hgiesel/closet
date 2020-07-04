import type { InactiveAdapter, InactiveBehavior, Ellipser, TagData, Internals, WeakFilterResult } from './types'
import type { CardPreset } from './flashcardTemplate'

import { StoreGetter, constantGet } from './valueStore'
import { cardNumberToNum } from './utils'

const constantFalse = constantGet(false)
const constantZero = constantGet(0)

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
    adapter: InactiveAdapter<T, CardPreset>,
) => (
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

    return adapter(behavior)(contexter, ellipser)(tag, internals)
}

export const inactiveAdapterWithinRange = <T extends object>(
    adapter: InactiveAdapter<CardPreset, T>,
): InactiveAdapter<CardPreset, CardPreset> => (
    behavior: InactiveBehavior<CardPreset, T>,
) => (
    contexter: Ellipser<CardPreset>,
    ellipser: Ellipser<CardPreset>,
) => (tag: TagData, internals: Internals<CardPreset & T>): WeakFilterResult => {
    const [
        cardNumber,
        showBottom,
        showTop,
        hideBottom,
        hideTop,
    ] = inactiveAdapterGetRange(tag, internals)

    if (!internals.preset.card) {
        return behavior(contexter, ellipser)(tag, internals)
    }

    if (cardNumber - showBottom <= tag.num && tag.num <= cardNumber + showTop) {
        return contexter(tag, internals)
    }

    if (cardNumber - hideBottom <= tag.num && tag.num <= cardNumber + hideTop) {
        return ellipser(tag, internals)
    }

    return adapter(behavior)(contexter, ellipser)(tag, internals)
}

export const inactiveAdapterGetRange = <T extends object>(tag: TagData, internals: Internals<CardPreset & T>): [number, number, number, number, number] => {
    const showBottomKeyword = 'flashcardShowBottom'
    const showTopKeyword = 'flashcardShowTop'

    const cardNumber = cardNumberToNum(internals.preset.card)

    const showBottom = internals.cache.get<StoreGetter<number>>(showBottomKeyword, constantZero)
        .get(tag.key, cardNumber, tag.fullOccur)

    const showTop = internals.cache.get<StoreGetter<number>>(showTopKeyword, constantZero)
        .get(tag.key, cardNumber, tag.fullOccur)

    const hideBottomKeyword = 'flashcardHideBottom'
    const hideTopKeyword = 'flashcardHideTop'

    const hideBottom = internals.cache.get<StoreGetter<number>>(hideBottomKeyword, constantZero)
        .get(tag.key, cardNumber, tag.fullOccur)

    const hideTop = internals.cache.get<StoreGetter<number>>(hideTopKeyword, constantZero)
        .get(tag.key, cardNumber, tag.fullOccur)

    return [cardNumber, showBottom, showTop, hideBottom, hideTop]
}

export const inactiveAdapterAll: InactiveAdapter<CardPreset,CardPreset> = inactiveAdapterOverwritten(inactiveAdapterWithinRange(inactiveAdapter))
