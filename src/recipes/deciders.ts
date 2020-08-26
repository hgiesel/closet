import type { TagNode, Internals } from './types'
import type { CardPreset, SidePreset } from './flashcardTemplate'
import type { StoreGetter } from './valueStore'

import { constantGet } from './valueStore'

export const isActiveWithinRange = (cardNumber: number, num: number, bottomRange: number, topRange: number): boolean => {
    return cardNumber - bottomRange <= num && num <= cardNumber + topRange
}

export const isActive = <T extends CardPreset>({ num }: TagNode, { preset }: Internals<T>): boolean => {
    switch (num) {
        case null:
            return false
        case 0:
            return true
        default:
            if (!preset.hasOwnProperty('cardNumber')) {
                return false
            }

            return num === preset.cardNumber
    }
}

export const isActiveGetRange = <T extends CardPreset>({ key, num, fullOccur }: TagNode, { preset, cache }: Internals<T>): boolean => {
    const bottomRangeKeyword = 'flashcardActiveBottom'
    const topRangeKeyword = 'flashcardActiveTop'
    const constantZero = constantGet(0)

    switch (num) {
        case null:
            return false
        case 0:
            return true
        default:
            if (typeof preset.cardNumber !== 'number') {
                return false
            }

            const bottomRange = cache.get<StoreGetter<number>>(bottomRangeKeyword, constantZero)
                .get(key, preset.cardNumber, fullOccur)

            const topRange = cache.get<StoreGetter<number>>(topRangeKeyword, constantZero)
                .get(key, preset.cardNumber, fullOccur)

            return isActiveWithinRange(preset.cardNumber, num, bottomRange, topRange)
    }
}

export const isActiveOverwritten = <T extends CardPreset>(tag: TagNode, internals: Internals<T>): boolean => {
    const activeKeyword = 'flashcardActive'

    const activeOverwrite = internals.cache.get<StoreGetter<boolean>>(activeKeyword, constantGet(false))
        .get(tag.key, tag.num, tag.fullOccur)

    return activeOverwrite
}

export const isActiveAll = <T extends CardPreset>(tag: TagNode, internals: Internals<T>): boolean => isActiveOverwritten(tag, internals) || isActiveGetRange(tag, internals)

//////////////////////////////////////////

export const isBack = <T extends SidePreset>(_t: TagNode, { preset }: Internals<T>) => {
    return preset.side === 'back'
}

export const isBackAll = isBack
