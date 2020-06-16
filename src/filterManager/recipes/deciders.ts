import type { Tag, Internals } from './types'

export const isBack = (_t: Tag, { preset }: Internals): boolean => {
    return preset['side'] === 'back'
}

export const isActive = ({ num }: Tag, { preset }: Internals): boolean => {
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
