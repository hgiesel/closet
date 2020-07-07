import type { InactiveAdapter, InactiveBehavior, Ellipser, TagData, Internals, WeakFilterResult, Stylizer } from './types'
import type { CardPreset } from './flashcardTemplate'

import { StoreGetter, constantGet } from './valueStore'

const constantFalse = constantGet(false)
const constantZero = constantGet(0)

export const inactiveAdapter = <T extends object>(
    behavior: InactiveBehavior<T, CardPreset>,
) => (
    stylizer: Stylizer,
    contexter: Ellipser<T, string[]>,
    ellipser: Ellipser<T, string[]>,
) => (
    tag: TagData,
    internals: Internals<T & CardPreset>,
) => behavior(stylizer, contexter, ellipser)(tag, internals)

export const inactiveAdapterOverwritten = <T extends object>(
    adapter: InactiveAdapter<CardPreset, T>,
): InactiveAdapter<CardPreset, CardPreset> => (
    behavior: InactiveBehavior<CardPreset, T>,
) => (
    stylizer: Stylizer,
    contexter: Ellipser<CardPreset, string[]>,
    ellipser: Ellipser<CardPreset, string[]>,
) => (tag: TagData, internals: Internals<CardPreset & T>): WeakFilterResult => {
    const showKeyword = 'flashcardShow'
    const hideKeyword = 'flashcardHide'

    const showOverwrite = internals.cache.get<StoreGetter<boolean>>(showKeyword, constantFalse)
        .get(tag.key, tag.num, tag.fullOccur)

    if (showOverwrite) {
        return stylizer.stylize(contexter(tag, internals))
    }

    const hideOverwrite = internals.cache.get<StoreGetter<boolean>>(hideKeyword, constantFalse)
        .get(tag.key, tag.num, tag.fullOccur)

    if (hideOverwrite) {
        return stylizer.stylize(ellipser(tag, internals))
    }

    return adapter(behavior)(stylizer, contexter, ellipser)(tag, internals)
}

export const inactiveAdapterWithinRange = <T extends object>(
    adapter: InactiveAdapter<CardPreset, T>,
): InactiveAdapter<CardPreset, CardPreset> => (
    behavior: InactiveBehavior<CardPreset, T>,
) => (
    stylizer: Stylizer,
    contexter: Ellipser<CardPreset, string[]>,
    ellipser: Ellipser<CardPreset, string[]>,
) => (tag: TagData, internals: Internals<CardPreset & T>): WeakFilterResult => {
    if (!internals.preset.hasOwnProperty('cardNumber')) {
        return adapter(behavior)(stylizer, contexter, ellipser)(tag, internals)
    }

    const [
        showBottom,
        showTop,
        hideBottom,
        hideTop,
    ] = inactiveAdapterGetRange(tag, internals)

    const cardNumber = internals.preset.cardNumber

    if (!cardNumber) {
        return behavior(stylizer, contexter, ellipser)(tag, internals)
    }

    if (cardNumber - showBottom <= tag.num && tag.num <= cardNumber + showTop) {
        return stylizer.stylize(contexter(tag, internals))
    }

    if (cardNumber - hideBottom <= tag.num && tag.num <= cardNumber + hideTop) {
        return stylizer.stylize(ellipser(tag, internals))
    }

    return adapter(behavior)(stylizer, contexter, ellipser)(tag, internals)
}

export const inactiveAdapterGetRange = <T extends object>(tag: TagData, internals: Internals<CardPreset & T>): [number, number, number, number] => {
    const showBottomKeyword = 'flashcardShowBottom'
    const showTopKeyword = 'flashcardShowTop'

    const showBottom = internals.cache.get<StoreGetter<number>>(showBottomKeyword, constantZero)
        .get(tag.key, internals.preset.cardNumber, tag.fullOccur)

    const showTop = internals.cache.get<StoreGetter<number>>(showTopKeyword, constantZero)
        .get(tag.key, internals.preset.cardNumber, tag.fullOccur)

    const hideBottomKeyword = 'flashcardHideBottom'
    const hideTopKeyword = 'flashcardHideTop'

    const hideBottom = internals.cache.get<StoreGetter<number>>(hideBottomKeyword, constantZero)
        .get(tag.key, internals.preset.cardNumber, tag.fullOccur)

    const hideTop = internals.cache.get<StoreGetter<number>>(hideTopKeyword, constantZero)
        .get(tag.key, internals.preset.cardNumber, tag.fullOccur)

    return [showBottom, showTop, hideBottom, hideTop]
}

export const inactiveAdapterAll: InactiveAdapter<CardPreset, CardPreset> = inactiveAdapterOverwritten(inactiveAdapterWithinRange(inactiveAdapter))
