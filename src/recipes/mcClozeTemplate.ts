import type { TagData, Internals, Filters, Stylizer, Ellipser, ActiveBehavior, InactiveBehavior, DataOptions } from './types'

import { fourWayWrap } from './nway'
import { isBack, isActive } from './deciders'
import { simpleRecipe } from './simple'

export interface McClozePreset {
    card: string
    side: 'front' | 'back'
}

export const mcClozeTemplate = (
    frontActiveBehavior: ActiveBehavior<McClozePreset, McClozePreset>,
    backActiveBehavior: ActiveBehavior<McClozePreset, McClozePreset>,
    dataOptions: Partial<DataOptions> = {},
) => (
    frontInactiveBehavior: InactiveBehavior<McClozePreset, McClozePreset>,
    backInactiveBehavior: InactiveBehavior<McClozePreset, McClozePreset>,
) => ({
    tagname,
    switcherKeyword = 'switch',
    activateKeyword = 'activate',

    frontStylizer,
    backStylizer,

    contexter,
    activeEllipser,
    inactiveEllipser,
}: {
    tagname: string,
    switcherKeyword: string,
    activateKeyword: string,

    frontStylizer: Stylizer,
    backStylizer: Stylizer,

    contexter: Ellipser<McClozePreset>,
    activeEllipser: Ellipser<McClozePreset>,
    inactiveEllipser: Ellipser<McClozePreset>,
}) => (filterApi: Filters<McClozePreset>) => {
    const internalFilter = `${tagname}:internal`
    let activeOverwrite = false

    const isActiveWithOverwrite = (t: TagData, inter: Internals<McClozePreset>) => isActive(t, inter) || activeOverwrite

    const mcClozeRecipe = fourWayWrap(
        isActiveWithOverwrite,
        isBack,
        simpleRecipe(frontInactiveBehavior(contexter, inactiveEllipser)),
        simpleRecipe(frontActiveBehavior(frontStylizer, activeEllipser)),
        simpleRecipe(backInactiveBehavior(contexter, inactiveEllipser)),
        simpleRecipe(backActiveBehavior(backStylizer, activeEllipser)),
    )

    mcClozeRecipe({ tagname: internalFilter })(filterApi)

    const mcClozeFilter = (tag: TagData, inter: Internals<McClozePreset>) => {
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
