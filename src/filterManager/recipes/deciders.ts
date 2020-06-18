import type { TagData, Internals } from './types'

export const isBack = (_t: TagData, { preset }: Internals): boolean => {
    return preset['side'] === 'back'
}

export const isActive = ({ num }: TagData, { preset }: Internals): boolean => {
    switch (num) {
        case null:
            return false
        case 0:
            return true
        default:
            if (!preset['card']) {
                return false
            }

            const cardNumber = preset['card'].match(/[0-9]*$/)
            return Number(cardNumber) === num
    }
}
