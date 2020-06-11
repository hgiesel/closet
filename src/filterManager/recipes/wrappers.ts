import type { Tag, FilterApi, Internals, Deferred, Recipe } from './types'
import type { DeferredApi } from '../deferred'

interface WrapOptions {
    wrapId?: string
    getTagnames?: (o: object) => string[]
    setTagnames?: (o: object, newNames: string[]) => void
}

interface WithInternalKeyword {
    keyInternal: string,
}

const defaultTagnameGetter = (o: object) => [o['tagname']]
const defaultTagnameSetter = (o: object, newNames: string[]) => o['tagname'] = newNames[0]
const defaultWrapId = 'wrapped'

export const wrap = (
    wrapped: (tag: Tag & WithInternalKeyword, internals: Internals) => void,
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

        wrapped(Object.assign({}, tag, { keyInternal: internalKeyword }), inter)

        return inter.filters.get(internalKeyword)(tag, inter)
    }

    for (const keyword of tagnames) {
        filterApi.register(keyword, wrapFilter)
    }
}

const wrapWithDeferredTemplate = (
    getDeferredApi: (i: Internals) => DeferredApi,
) => (
    action: Deferred,
    mainRecipe: Recipe,
    wrapOptions: WrapOptions = {},
): Recipe => {
    return wrap((t, internals) => {
        getDeferredApi(internals).registerIfNotExists(t.keyInternal, action)
    })(mainRecipe, wrapOptions)
}

export const wrapWithDeferred = wrapWithDeferredTemplate(inter => inter.deferred)
export const wrapWithAftermath = wrapWithDeferredTemplate(inter => inter.aftermath)
