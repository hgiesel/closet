import type { TagData, Internals, Filters, ActiveBehavior, InactiveBehavior, WeakDataOptions } from './types'

import { fourWayWrap } from './nway'
import { isBack, isActive } from './deciders'
import { simpleRecipe } from './simple'

export const mcClozeTemplate = (
    frontActiveBehavior: ActiveBehavior,
    backActiveBehavior: ActiveBehavior,
    dataOptions: WeakDataOptions = null,
) => (
    frontInactiveBehavior: InactiveBehavior,
    backInactiveBehavior: InactiveBehavior,
) => ({
    tagname,
    switcherKeyword = 'switch',
    activateKeyword = 'activate',

    frontStylizer,
    backStylizer,

    contexter,
    activeEllipser,
    inactiveEllipser,

}) => (filterApi: Filters) => {
    const internalFilter = `${tagname}:internal`
    let activeOverwrite = false

    const isActiveWithOverwrite = (t: TagData, inter: Internals) => isActive(t, inter) || activeOverwrite

    const mcClozeRecipe = fourWayWrap(
        isActiveWithOverwrite,
        isBack,
        simpleRecipe(frontInactiveBehavior(contexter, inactiveEllipser)),
        simpleRecipe(frontActiveBehavior(frontStylizer, activeEllipser)),
        simpleRecipe(backInactiveBehavior(contexter, inactiveEllipser)),
        simpleRecipe(backActiveBehavior(backStylizer, activeEllipser)),
    )

    mcClozeRecipe({ tagname: internalFilter })(filterApi)

    const mcClozeFilter = (tag: TagData, inter: Internals) => {
        const theFilter = inter.cache.get(`${tagname}:${switcherKeyword}`, {
            get: (_k: string, _n: number | null, _o: number) => internalFilter,
        }).get(tag.key, tag.num, tag.fullOccur)

        activeOverwrite = inter.cache.get(`${tagname}:${activateKeyword}`, {
            get: (_k: string, _n: number | null, _o: number) => false,
        }).get(tag.key, tag.num, tag.fullOccur)

        return  inter.filters.get(theFilter)(tag, inter)
    }

    filterApi.register(tagname, mcClozeFilter, dataOptions)
}
