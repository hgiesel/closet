import { TagData, Ellipser, Internals } from './types'
import { zeroWidthSpace } from './utils'
import { Stylizer } from './stylizer'

const zeroWrap = (v: string) => zeroWidthSpace + v + zeroWidthSpace

export const stylizeEllipser = (
    stylizer: Stylizer,
    getValues: (tag: TagData, inter: Internals) => string[],
): Ellipser => (tag: TagData, inter: Internals): string => {
    return zeroWrap(stylizer.stylize(getValues(tag, inter)))
}

export const noneEllipser: Ellipser = (): string => zeroWrap('[...]')
