import type { TagData, Internals } from './types'
import type { CardPreset, SidePreset } from './flashcardTemplate'

import { constantGet, StoreGetter } from './valueStore'
import { cardNumberToNum } from './utils'

export type Decider<T extends object> = (t: TagData, i: Internals<T>) => boolean

export const isActiveWithinRange = (cardNumber: number, num: number, bottomRange: number, topRange: number): boolean => {
    return cardNumber - bottomRange <= num && num <= cardNumber + topRange
}

export const isActive = ({ num }: TagData, { preset }: Internals<CardPreset>): boolean => {
    switch (num) {
        case null:
            return false
        case 0:
            return true
        default:
            if (!preset.card) {
                return false
            }

            const cardNumber = cardNumberToNum(preset.card)
            return num === cardNumber
    }
}

export const isActiveGetRange = ({ key, num, fullOccur }: TagData, { preset, cache }: Internals<CardPreset>): boolean => {
    const bottomRangeKeyword = 'flashcardActiveBottom'
    const topRangeKeyword = 'flashcardActiveTop'
    const constantZero = constantGet(0)

    switch (num) {
        case null:
            return false
        case 0:
            return true
        default:
            if (!preset.card) {
                return false
            }

            const cardNumber = cardNumberToNum(preset.card)

            const bottomRange = cache.get<StoreGetter<number>>(bottomRangeKeyword, constantZero)
                .get(key, cardNumber, fullOccur)

            const topRange = cache.get<StoreGetter<number>>(topRangeKeyword, constantZero)
                .get(key, cardNumber, fullOccur)

            return isActiveWithinRange(cardNumber, num, bottomRange, topRange)
    }
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
