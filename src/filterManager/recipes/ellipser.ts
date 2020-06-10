import { Tag, Internals, Ellipser } from './types'
import { zeroWidthSpace } from './utils'
import { rawStylizer } from './stylizer'

export const hintEllipser: Ellipser = ({ values }: Tag, _inter: Internals): string => {
    return zeroWidthSpace + '[' + (
        values[1] ? rawStylizer.stylize(values[1]) : '...'
    ) + ']' + zeroWidthSpace
}

export const noneEllipser: Ellipser = (): string => {
    return zeroWidthSpace + '[...]' + zeroWidthSpace
}
