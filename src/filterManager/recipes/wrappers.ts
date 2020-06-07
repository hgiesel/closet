import type { Tag } from '../../tags'
import type { FilterApi } from '../filters'
import type { Internals } from '..'

export const withDeferredRecipe = (
    action,
    getRecipe,
) => (filterApi: FilterApi) => {

    const clozeFilter = (tag: Tag, inter: Internals) => {
        inter.

        return  inter.filters.get(theFilter)(tag, inter)
    }

    filterApi.register(keyword, clozeFilter)
}
