import type { Tag } from '../../tags'
import type { Internals } from '..'

export const isBack = (_t: Tag, { preset }: Internals) => {
    return preset['side'] === 'back'
}

export const isCurrent = ({ num }: Tag, { preset }: Internals) => {
    if (num === null) {
        return true
    }

    else if (!preset['card']) {
        return false
    }

    const cardNumber = preset['card'].match(/[0-9]*$/)
    return Number(cardNumber) === num
}
