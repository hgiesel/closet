import type { TagNode, RecipeOptions, Registrar, Internals, Deferred, Recipe, WrapOptions, DeferredApi } from './types'

interface WithInternalKeyword {
    keyInternal: string,
}

export const defaultTagnameGetter = (o: RecipeOptions) => o.hasOwnProperty('tagname') ? [o['tagname']] : []
export const defaultTagnameSetter = (o: RecipeOptions, newNames: string[]) => o['tagname'] = newNames[0]

const defaultWrapId = 'wrapped'

export const wrap = <T extends object>(
    wrapped: (tag: TagNode & WithInternalKeyword, internals: Internals<T>) => void,
) => (
    mainRecipe: Recipe<T>, {
        wrapId,
        getTagnames,
        setTagnames,
    }: WrapOptions = {
        wrapId: defaultWrapId,
        getTagnames: defaultTagnameGetter,
        setTagnames: defaultTagnameSetter,
    },
): Recipe<T> => (
    options: RecipeOptions = {},
) => (registrar: Registrar<T>): void => {
    const tagnames = getTagnames(options)

    const makeInternalKeyword = (keyword: string) => `${keyword}:${wrapId}:internal`

    const keywordMap = new Map()
    const alteredTagnames = tagnames.map(keyword => {
        const internalKeyword = makeInternalKeyword(keyword)
        keywordMap.set(keyword, internalKeyword)
        return internalKeyword
    })

    setTagnames(options, alteredTagnames)
    mainRecipe(options)(registrar)

    const wrapFilter = (tag: TagNode, inter: Internals<T>) => {
        const internalKeyword = keywordMap.get(tag.key)

        wrapped(Object.assign({}, tag, { keyInternal: internalKeyword }), inter)

        return inter.filters.getOrDefault(internalKeyword)(tag, inter)
    }

    for (const keyword of tagnames) {
        registrar.register(keyword, wrapFilter, registrar.getOptions(makeInternalKeyword(keyword)))
    }
}

const wrapWithDeferredTemplate = <T extends object, D>(
    getDeferredApi: (i: Internals<T>) => DeferredApi<D>,
) => (
    mainRecipe: Recipe<T>,
    action: Deferred<D>,
    wrapOptions: WrapOptions = {
        wrapId: defaultWrapId,
        getTagnames: defaultTagnameGetter,
        setTagnames: defaultTagnameSetter,
    },
): Recipe<T> => {
    return wrap((t, internals: Internals<T>) => {
        getDeferredApi(internals).registerIfNotExists(t.keyInternal, action)
    })(mainRecipe, wrapOptions)
}

export const wrapWithDeferred = wrapWithDeferredTemplate(inter => inter.deferred)
export const wrapWithAftermath = wrapWithDeferredTemplate(inter => inter.aftermath)
