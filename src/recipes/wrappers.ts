import type { TagData, Filters, Internals, Deferred, Recipe, WrapOptions, DeferredApi } from './types'

interface WithInternalKeyword {
    keyInternal: string,
}

const defaultTagnameGetter = (o: object) => [o['tagname']]
const defaultTagnameSetter = (o: object, newNames: string[]) => o['tagname'] = newNames[0]
const defaultWrapId = 'wrapped'

export const wrap = <T extends object>(
    wrapped: (tag: TagData & WithInternalKeyword, internals: Internals<T>) => void,
) => (
    mainRecipe: Recipe<T>, {
        wrapId = defaultWrapId,
        getTagnames = defaultTagnameGetter,
        setTagnames = defaultTagnameSetter,
    }: WrapOptions = {},
): Recipe<T> => (
    options = {},
) => (filterApi: Filters<T>): void => {
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

    const wrapFilter = (tag: TagData, inter: Internals<T>) => {
        const internalKeyword = keywordMap.get(tag.key)

        wrapped(Object.assign({}, tag, { keyInternal: internalKeyword }), inter)

        return inter.filters.get(internalKeyword)(tag, inter)
    }

    for (const keyword of tagnames) {
        filterApi.register(keyword, wrapFilter, filterApi.getOptions(makeInternalKeyword(keyword)))
    }
}

const wrapWithDeferredTemplate = <T extends object, D>(
    getDeferredApi: (i: Internals<T>) => DeferredApi<D>,
) => (
    action: Deferred<D>,
    mainRecipe: Recipe<T>,
    wrapOptions: WrapOptions = {},
): Recipe<T> => {
    return wrap((t, internals) => {
        getDeferredApi(internals).registerIfNotExists(t.keyInternal, action)
    })(mainRecipe, wrapOptions)
}

export const wrapWithDeferred = wrapWithDeferredTemplate(inter => inter.deferred)
export const wrapWithAftermath = wrapWithDeferredTemplate(inter => inter.aftermath)
