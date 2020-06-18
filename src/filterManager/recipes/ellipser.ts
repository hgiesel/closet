import { TagData, Internals, Ellipser, WeakSeparator } from './types'
import { zeroWidthSpace } from './utils'
import { Stylizer } from './stylizer'

const zeroWrap = (v: string) => zeroWidthSpace + v + zeroWidthSpace

export const stylizeEllipser = (
    stylizer: Stylizer,
    separator: WeakSeparator = '..',
): Ellipser => (
    { values }: TagData,
    _inter: Internals,
): string => {
    return zeroWrap(stylizer.stylize(values(separator)))
}

export const noneEllipser: Ellipser = (): string => zeroWrap('[...]')
