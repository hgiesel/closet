import { Tag, Internals, Ellipser } from './types'
import { zeroWidthSpace } from './utils'
import { Stylizer, FullStylizer } from './stylizer'

const zeroWrap = (v: string) => zeroWidthSpace + v + zeroWidthSpace

export const stylizeFullEllipser = (
    fullStylizer: FullStylizer,
) => ({ values }: Tag, _inter: Internals): string => {
    return zeroWrap(fullStylizer.stylizeFull(values))
}

export const stylizeEllipser = (
    stylizer: Stylizer,
    getValues: (vs: string[][]) => string[],
) => ({ values }: Tag, _inter: Internals): string => {
    return zeroWrap(stylizer.stylize(getValues(values)))
}

export const noneEllipser: Ellipser = (): string => {
    return zeroWidthSpace + '[...]' + zeroWidthSpace
}
