import type { TagData, Internals } from './types'

export type Decider<T extends object> = (t: TagData, i: Internals<T>) => boolean

const defaultGet = <T>(v: T) => ({ get: () => v })
const cardNumberToNum = (textNum: string): number => Number(textNum.match(/[0-9]*$/))

export const isActiveWithinRange = (bottomRange: number, topRange: number) => ({ num }: TagData, { preset }: Internals<{ card: string }>): boolean => {
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

type StoreGetter<T> = { get: (key: string, num: number | null, occur: number) => T }

export const isActiveGetRange = (tag: TagData, internals: Internals<{ card: string }>): boolean => {
    const bottomRangeKeyword = 'bottom'
    const topRangeKeyword = 'top'

    const bottomRange = internals.cache.get<StoreGetter<number>>(
        bottomRangeKeyword,
        defaultGet(0),
    ).get(tag.key, tag.num, tag.fullOccur)

    const topRange = internals.cache.get<StoreGetter<number>>(
        topRangeKeyword,
        defaultGet(0),
    ).get(tag.key, tag.num, tag.fullOccur)

    return isActiveWithinRange(bottomRange, topRange)(tag, internals)
}

export const isActiveOverwritten = (tag: TagData, internals: Internals<{ card: string }>): boolean => {
    const activeKeyword = 'active'

    const activeOverwrite = internals.cache.get<StoreGetter<boolean>>(
        activeKeyword,
        defaultGet(false),
    ).get(tag.key, tag.num, tag.fullOccur)

    return activeOverwrite
}

export const isActiveAll = (tag: TagData, internals: Internals<{ card: string }>): boolean => isActiveOverwritten(tag, internals) || isActiveGetRange(tag, internals)

//////////////////////////////////////////

export const isBackAll: Decider<{ side: 'front' | 'back' }> = (_t, { preset }) => {
    return preset['side'] === 'back'
}
