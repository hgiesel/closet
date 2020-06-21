import type { TagData, FilterApi, Internals, Deferred, Recipe, WrapOptions, DeferredApi } from './types'

interface WithInternalKeyword {
    keyInternal: string,
}

const defaultTagnameGetter = (o: object) => [o['tagname']]
const defaultTagnameSetter = (o: object, newNames: string[]) => o['tagname'] = newNames[0]
const defaultWrapId = 'wrapped'

export const wrap = (
    wrapped: (tag: TagData & WithInternalKeyword, internals: Internals) => void,
) => (
    mainRecipe: Recipe, {
        wrapId = defaultWrapId,
        getTagnames = defaultTagnameGetter,
        setTagnames = defaultTagnameSetter,
    }: WrapOptions = {},
): Recipe => (
    options = {},
) => (filterApi: FilterApi): void => {
    const tagnames = getTagnames(options)

    const makeInternalKeyword = (keyword: string) => `${keyword}:${wrapId}:internal`

    const keywordMap = new Map()
    const alteredTagnames = tagnames.map(keyword => {
        const internalKeyword = makeInternalKeyword(keyword)
        keywordMap.set(keyword, internalKeyword)
        return internalKeyword
    })

    setTagnames(options, alteredTagnames)
    mainRecipe(options)(filterApi)

    const wrapFilter = (tag: TagData, inter: Internals) => {
        const internalKeyword = keywordMap.get(tag.key)

        wrapped(Object.assign({}, tag, { keyInternal: internalKeyword }), inter)

        return inter.filters.get(internalKeyword)(tag, inter)
    }

    for (const keyword of tagnames) {
        filterApi.register(keyword, wrapFilter, filterApi.getOptions(makeInternalKeyword(keyword)))
    }
}

const wrapWithDeferredTemplate = <T>(
    getDeferredApi: (i: Internals) => DeferredApi<T>,
) => (
    action: Deferred<T>,
    mainRecipe: Recipe,
    wrapOptions: WrapOptions = {},
): Recipe => {
    return wrap((t, internals) => {
        getDeferredApi(internals).registerIfNotExists(t.keyInternal, action)
    })(mainRecipe, wrapOptions)
}

export const wrapWithDeferred = wrapWithDeferredTemplate(inter => inter.deferred)
export const wrapWithAftermath = wrapWithDeferredTemplate(inter => inter.aftermath)
