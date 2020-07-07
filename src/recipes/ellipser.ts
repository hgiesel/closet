import { TagData, Ellipser, Internals } from './types'
import { zeroWidthSpace } from './utils'
import { Stylizer } from './stylizer'

const zeroWrap = (v: string) => zeroWidthSpace + v + zeroWidthSpace

export const stylizeEllipser = <T extends object>(
    stylizer: Stylizer,
    getValues: (tag: TagData, inter: Internals<T>) => string[],
): Ellipser<T> => (tag: TagData, inter: Internals<T>): string => {
    return zeroWrap(stylizer.stylize(getValues(tag, inter)))
}

export const noneEllipser = <T extends object>(_t: TagData, _i: Internals<T>): string => zeroWrap('[...]')

export const keyEllipser = <T extends object>(t: TagData, _i: Internals<T>): string => t.key
export const fullKeyEllipser = <T extends object>(t: TagData, _i: Internals<T>): string => t.fullKey
export const uidEllipser = <T extends object>(t: TagData, _i: Internals<T>): string => t.fullKey + t.fullOccur
