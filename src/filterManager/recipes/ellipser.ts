import { Tag, Internals, Ellipser, FilterApi, Recipe } from './types'
import { zeroWidthSpace } from './utils'
import { Stylizer, FullStylizer } from './stylizer'

const zeroWrap = (v: string) => zeroWidthSpace + v + zeroWidthSpace

export const stylizeFullEllipser = (
    fullStylizer: FullStylizer,
): Ellipser => (
    { values }: Tag,
    _inter: Internals,
): string => {
    return zeroWrap(fullStylizer.stylizeFull(values))
}

export const stylizeEllipser = (
    stylizer: Stylizer,
    getValues: (vs: string[][]) => string[],
): Ellipser => (
    { values }: Tag,
    _inter: Internals,
): string => {
    return zeroWrap(stylizer.stylize(getValues(values)))
}

export const noneEllipser: Ellipser = (): string => zeroWrap('[...]')

export const toSimpleRecipe = (ellipser: Ellipser): Recipe => ({
    tagname,
}: {
    tagname: string,
}) => (filterApi: FilterApi) => {
    filterApi.register(tagname, ellipser)
}
