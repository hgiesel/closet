import type {
    InactiveAdapter,
    InactiveBehavior,
    TagNode,
    Internals,
    WeakFilter,
    WeakFilterResult,
} from "../types";
import type { StoreGetter } from "../recipes/preferenceStore";
import type { CardPreset } from "./flashcardTemplate";

import { constantGet } from "../recipes/preferenceStore";

const constantFalse = constantGet(false);
const constantZero = constantGet(0);

export const inactiveAdapter = <T extends CardPreset>(
    behavior: InactiveBehavior<T>,
) => (contexter: WeakFilter<T>, ellipser: WeakFilter<T>) => (
    tag: TagNode,
    internals: Internals<T>,
) => behavior(contexter, ellipser)(tag, internals);

export const inactiveAdapterOverwritten = <T extends CardPreset>(
    adapter: InactiveAdapter<T>,
): InactiveAdapter<T> => (behavior: InactiveBehavior<T>) => (
    contexter: WeakFilter<T>,
    ellipser: WeakFilter<T>,
) => (tag: TagNode, internals: Internals<T>): WeakFilterResult => {
    const showKeyword = "flashcardShow";
    const hideKeyword = "flashcardHide";

    const showOverwrite = internals.cache
        .get<StoreGetter<boolean>>(showKeyword, constantFalse)
        .get(tag.key, tag.num, tag.fullOccur);

    if (showOverwrite) {
        return contexter(tag, internals);
    }

    const hideOverwrite = internals.cache
        .get<StoreGetter<boolean>>(hideKeyword, constantFalse)
        .get(tag.key, tag.num, tag.fullOccur);

    if (hideOverwrite) {
        return ellipser(tag, internals);
    }

    return adapter(behavior)(contexter, ellipser)(tag, internals);
};

export const inactiveAdapterWithinRange = <T extends CardPreset>(
    adapter: InactiveAdapter<T>,
): InactiveAdapter<T> => (behavior: InactiveBehavior<T>) => (
    contexter: WeakFilter<T>,
    ellipser: WeakFilter<T>,
) => (tag: TagNode, internals: Internals<T>): WeakFilterResult => {
    if (!Object.prototype.hasOwnProperty.call(internals.preset, "cardNumber")) {
        return adapter(behavior)(contexter, ellipser)(tag, internals);
    }

    const [showBottom, showTop, hideBottom, hideTop] = inactiveAdapterGetRange(
        tag,
        internals,
    );

    const cardNumber = internals.preset.cardNumber;

    if (!cardNumber || !tag.num) {
        return behavior(contexter, ellipser)(tag, internals);
    }

    if (cardNumber - showBottom <= tag.num && tag.num <= cardNumber + showTop) {
        return contexter(tag, internals);
    }

    if (cardNumber - hideBottom <= tag.num && tag.num <= cardNumber + hideTop) {
        return ellipser(tag, internals);
    }

    return adapter(behavior)(contexter, ellipser)(tag, internals);
};

export const inactiveAdapterGetRange = <T extends CardPreset>(
    tag: TagNode,
    { cache, preset }: Internals<T>,
): [number, number, number, number] => {
    const showBottomKeyword = "flashcardShowBottom";
    const showTopKeyword = "flashcardShowTop";

    if (!preset.cardNumber) {
        return [0, 0, 0, 0];
    }

    const showBottom = cache
        .get<StoreGetter<number>>(showBottomKeyword, constantZero)
        .get(tag.key, preset.cardNumber, tag.fullOccur);

    const showTop = cache
        .get<StoreGetter<number>>(showTopKeyword, constantZero)
        .get(tag.key, preset.cardNumber, tag.fullOccur);

    const hideBottomKeyword = "flashcardHideBottom";
    const hideTopKeyword = "flashcardHideTop";

    const hideBottom = cache
        .get<StoreGetter<number>>(hideBottomKeyword, constantZero)
        .get(tag.key, preset.cardNumber, tag.fullOccur);

    const hideTop = cache
        .get<StoreGetter<number>>(hideTopKeyword, constantZero)
        .get(tag.key, preset.cardNumber, tag.fullOccur);

    return [showBottom, showTop, hideBottom, hideTop];
};

export const inactiveAdapterAll = inactiveAdapterOverwritten(
    inactiveAdapterWithinRange(inactiveAdapter),
);
