import type { TagData, Internals } from './types'
import type { CardPreset, SidePreset } from './flashcardTemplate'

import { constantGet, StoreGetter } from './valueStore'
import { cardNumberToNum } from './utils'

export type Decider<T extends object> = (t: TagData, i: Internals<T>) => boolean

export const isActiveWithinRange = (bottomRange: number, topRange: number) => ({ num }: TagData, { preset }: Internals<CardPreset>): boolean => {
    switch (num) {
        case null:
            return false
        case 0:
            return true
        default:
            if (!preset['card']) {
                return false
            }

            const cardNumber = cardNumberToNum(preset['card'])
            return cardNumber - bottomRange <= num && num <= cardNumber + topRange
    }
}

export const isActive = isActiveWithinRange(0, 0)

export const isActiveGetRange = (tag: TagData, internals: Internals<CardPreset>): boolean => {
    const bottomRangeKeyword = 'flashcardActiveBottom'
    const topRangeKeyword = 'flashcardActiveTop'
    const constantZero = constantGet(0)

    const bottomRange = internals.cache.get<StoreGetter<number>>(bottomRangeKeyword, constantZero)
        .get(tag.key, tag.num, tag.fullOccur)

    const topRange = internals.cache.get<StoreGetter<number>>(topRangeKeyword, constantZero)
        .get(tag.key, tag.num, tag.fullOccur)

    return isActiveWithinRange(bottomRange, topRange)(tag, internals)
}

export const isActiveOverwritten = (tag: TagData, internals: Internals<CardPreset>): boolean => {
    const activeKeyword = 'flashcardActive'

    const activeOverwrite = internals.cache.get<StoreGetter<boolean>>(activeKeyword, constantGet(false))
        .get(tag.key, tag.num, tag.fullOccur)

    return activeOverwrite
}

export const isActiveAll = (tag: TagData, internals: Internals<CardPreset>): boolean => isActiveOverwritten(tag, internals) || isActiveGetRange(tag, internals)

//////////////////////////////////////////

export const isBack: Decider<SidePreset> = (_t, { preset }) => {
    return preset['side'] === 'back'
}

export const isBackAll = isBack
