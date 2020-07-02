import type { TagData, Registrar, FilterPredicate, Internals, Recipe, WrapOptions } from './types'

export const sum = <T extends object, U extends object>(
    recipeFalse: Recipe<T>,
    recipeTrue: Recipe<U>,
    predicate: FilterPredicate<T & U>, {
        setTagnames = (options, newNames) => options['tagname'] = newNames[0],
    }: WrapOptions = {},
): Recipe<T & U> => ({
    tagname,

    optionsFalse = {},
    optionsTrue = {},
}: {
    tagname: string,

    optionsTrue: object,
    optionsFalse: object,
}) => (registrar: Registrar<T & U>) => {
    const tagnameTrue = `${tagname}:sum:true`
    const tagnameFalse = `${tagname}:sum:false`

    setTagnames(optionsTrue, [tagnameTrue])
    setTagnames(optionsFalse, [tagnameFalse])

    recipeTrue(optionsTrue)(registrar)
    recipeFalse(optionsFalse)(registrar)

    const sumFilter = (
        tag: TagData,
        internals: Internals<T & U>,
    ) => {
        return predicate(tag, internals)
            ? internals.filters.get(tagnameTrue)(tag, internals)
            : internals.filters.get(tagnameFalse)(tag, internals)
    }

    registrar.register(tagname, sumFilter, registrar.getOptions(tagnameTrue /* have to be same for True/False */))
}

export const sumFour = <T extends object, U extends object, V extends object, W extends object>(
    recipeZero: Recipe<T>,
    recipeOne: Recipe<U>,
    recipeTwo: Recipe<V>,
    recipeThree: Recipe<W>,
    predicateOne: FilterPredicate<T & U & V & W>,
    predicateTwo: FilterPredicate<T & U & V & W>, {
        setTagnames = (options, newNames) => options['tagname'] = newNames[0],
    }: WrapOptions = {},
): Recipe<T & U & V & W> => ({
    tagname,

    optionsZero = {},
    optionsOne = {},
    optionsTwo = {},
    optionsThree = {},

}: {
    tagname: string,
    predicateOne: (t: TagData, inter: Internals<T & U & V & W>) => boolean,
    predicateTwo: (t: TagData, inter: Internals<T & U & V & W>) => boolean,

    optionsThree: object,
    optionsTwo: object,
    optionsOne: object,
    optionsZero: object,

    setTagname: (options: object, newName: string) => void,
}) => (registrar: Registrar<T & U & V & W>) => {
    const tagnameZero = `${tagname}:sumFour:zero`
    const tagnameTwo = `${tagname}:sumFour:two`

    setTagnames(optionsZero, [tagnameZero])
    setTagnames(optionsOne, [tagnameZero])

    sum(recipeZero, recipeOne, predicateOne)({
        tagname: tagnameZero,

        optionsFalse: optionsZero,
        optionsTrue: optionsOne,
    })(registrar)

    setTagnames(optionsTwo, [tagnameTwo])
    setTagnames(optionsThree, [tagnameTwo])

    sum(recipeTwo, recipeThree, predicateOne)({
        tagname: tagnameTwo,

        optionsFalse: optionsTwo,
        optionsTrue: optionsThree,
    })(registrar)

    const sumFourFilter = (
        tag: TagData,
        internals: Internals<T & U & V & W>,
    ) => {
        return predicateTwo(tag, internals)
            ? internals.filters.get(tagnameTwo)(tag, internals)
            : internals.filters.get(tagnameZero)(tag, internals)
    }

    registrar.register(tagname, sumFourFilter)
}
