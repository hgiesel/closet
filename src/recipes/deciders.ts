import type { TagData, Internals } from './types'

export const isBack = (_t: TagData, { preset }: Internals<{ side: 'front' | 'back' }>): boolean => {
    return preset['side'] === 'back'
}

export const isActive = (bottomRange: number, topRange: number) => (
    { num }: TagData, { preset }: Internals<{ card: string }>
): boolean => {
    switch (num) {
        case null:
            return false
        case 0:
            return true
        default:
            if (!preset['card']) {
                return false
            }

            const cardNumber = Number(preset['card'].match(/[0-9]*$/))
            return num - bottomRange <= cardNumber && cardNumber <= num + topRange
    }
}
