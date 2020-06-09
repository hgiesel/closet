import type { Tag, FilterApi, Internals, Deferred, Recipe } from './types'
import type { DeferredApi } from '../deferred'
import { id } from './utils'

const defaultTagnameGetter = (o: object) => [o['tagname']]
const defaultTagnameSetter = (o: object, newNames: string[]) => o['tagname'] = newNames[0]

const wrapWithDeferredTypeTemplate = (
    getApi: (inter: Internals) => DeferredApi,
) => (
    action: Deferred,
    mainRecipe: Recipe, {
        wrapId = 'wrapped',
        getTagnames = defaultTagnameGetter,
        setTagnames = defaultTagnameSetter,
        getApiKeyword = id as (v: string) => string,
    } = {},
): Recipe => (
    options = {},
) => (filterApi: FilterApi) => {
    const tagnames = getTagnames(options)

    const keywordMap = new Map()
    const alteredTagnames = tagnames.map(keyword => {
        const internalKeyword = `${keyword}:${wrapId}:internal`
        keywordMap.set(keyword, internalKeyword)
        return internalKeyword
    })

    setTagnames(options, alteredTagnames)
    mainRecipe(options)(filterApi)

    const wrapFilter = (tag: Tag, inter: Internals) => {
        const internalKeyword = keywordMap.get(tag.key)
        const apiKeyword = getApiKeyword(internalKeyword)

        getApi(inter).registerIfNotExists(apiKeyword, action)

        return inter.filters.get(internalKeyword)(tag, inter)
    }

    for (const keyword of tagnames) {
        filterApi.register(keyword, wrapFilter)
    }
}

export const wrapWithDeferred = wrapWithDeferredTypeTemplate(inter => inter.deferred)
export const wrapWithAftermath = wrapWithDeferredTypeTemplate(inter => inter.aftermath)
