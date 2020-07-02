import type { TagData, Registrar, WeakFilter, WeakFilterResult, Internals, Recipe, WrapOptions } from './types'

export const product = <T extends object, U extends object>(
    multiply: (fst: WeakFilterResult, snd: WeakFilterResult) => WeakFilter<T & U>,
    recipeFirst: Recipe<T>,
    recipeSecond: Recipe<U>, {
        setTagnames = (options, newNames) => options['tagname'] = newNames[0],
    }: WrapOptions = {},
): Recipe<T & U> => ({
    tagname,

    optionsFirst = {},
    optionsSecond = {},
}: {
    tagname: string,

    optionsFirst: object,
    optionsSecond: object,
}) => (registrar: Registrar<T & U>) => {
    const tagnameTrue = `${tagname}:product:fst`
    const tagnameFalse = `${tagname}:product:snd`

    setTagnames(optionsFirst, [tagnameTrue])
    setTagnames(optionsSecond, [tagnameFalse])

    recipeFirst(optionsFirst)(registrar)
    recipeSecond(optionsSecond)(registrar)

    const productFilter = (
        tag: TagData,
        internals: Internals<T & U>,
    ) => {
        return multiply(
            internals.filters.get(tagnameTrue)(tag, internals),
            internals.filters.get(tagnameFalse)(tag, internals),
        )(tag, internals)
    }

    registrar.register(tagname, productFilter, registrar.getOptions(tagnameTrue /* have to be same for True/False */))
}
