import type { Tag, FilterApi, Internals, Deferred, Recipe } from './types'
import type { DeferredApi } from '../deferred'

const wrapWithDeferredTypeTemplate = (
    getApi: (inter: Internals) => DeferredApi,
) => (
    wrapId: string,
    action: Deferred,
    mainRecipe: Recipe,
): Recipe => (
    keyword: string,
    options = {},
) => (filterApi: FilterApi) => {
    const internalKeyword = `${keyword}:${wrapId}:internal`
    mainRecipe(internalKeyword, options)(filterApi)

    const wrapFilter = (tag: Tag, inter: Internals) => {
        getApi(inter).registerIfNotExists(`${wrapId}:${keyword}`, action)

        console.log(inter, inter.filters.get(internalKeyword))
        return inter.filters.get(internalKeyword)(tag, inter)
    }

    filterApi.register(keyword, wrapFilter)
}

export const wrapWithDeferred = wrapWithDeferredTypeTemplate(inter => inter.deferred)
export const wrapWithAftermath = wrapWithDeferredTypeTemplate(inter => inter.aftermath)
