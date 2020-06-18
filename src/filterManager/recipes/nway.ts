import type { TagData, FilterApi, FilterPredicate, Internals, Recipe, WrapOptions } from './types'

export const twoWayWrap = (
    predicate: FilterPredicate,
    recipeFalse: Recipe,
    recipeTrue: Recipe, {
        setTagnames = (options, newNames) => options['tagname'] = newNames[0],
    }: WrapOptions = {},
): Recipe => ({
    tagname,

    optionsFalse = {},
    optionsTrue = {},
}: {
    tagname: string,

    optionsTrue: object,
    optionsFalse: object,
}) => (filterApi: FilterApi) => {
    const tagnameTrue = `${tagname}:twoWay:true`
    const tagnameFalse = `${tagname}:twoWay:false`

    setTagnames(optionsTrue, [tagnameTrue])
    setTagnames(optionsFalse, [tagnameFalse])

    recipeTrue(optionsTrue)(filterApi)
    recipeFalse(optionsFalse)(filterApi)

    const twoWayFilter = (
        tag: TagData,
        internals: Internals,
    ) => {
        return predicate(tag, internals)
            ? internals.filters.get(tagnameTrue)(tag, internals)
            : internals.filters.get(tagnameFalse)(tag, internals)
    }

    filterApi.register(tagname, twoWayFilter)
}

export const fourWayWrap = (
    predicateOne: FilterPredicate,
    predicateTwo: FilterPredicate,
    recipeZero: Recipe,
    recipeOne: Recipe,
    recipeTwo: Recipe,
    recipeThree: Recipe, {
        setTagnames = (options, newNames) => options['tagname'] = newNames[0],
    }: WrapOptions = {},
): Recipe => ({
    tagname,

    optionsZero = {},
    optionsOne = {},
    optionsTwo = {},
    optionsThree = {},

}: {
    tagname: string,
    predicateOne: (t: TagData, inter: Internals) => boolean,
    predicateTwo: (t: TagData, inter: Internals) => boolean,

    optionsThree: object,
    optionsTwo: object,
    optionsOne: object,
    optionsZero: object,

    setTagname: (options: object, newName: string) => void,
}) => (filterApi: FilterApi) => {
    const tagnameZero = `${tagname}:fourWay:zero`
    const tagnameTwo = `${tagname}:fourWay:two`

    setTagnames(optionsZero, [tagnameZero])
    setTagnames(optionsOne, [tagnameZero])

    twoWayWrap(predicateOne, recipeZero, recipeOne)({
        tagname: tagnameZero,

        optionsFalse: optionsZero,
        optionsTrue: optionsOne,
    })(filterApi)

    setTagnames(optionsTwo, [tagnameTwo])
    setTagnames(optionsThree, [tagnameTwo])

    twoWayWrap(predicateOne, recipeTwo, recipeThree)({
        tagname: tagnameTwo,

        optionsFalse: optionsTwo,
        optionsTrue: optionsThree,
    })(filterApi)

    const fourWayFilter = (
        tag: TagData,
        internals: Internals,
    ) => {
        return predicateTwo(tag, internals)
            ? internals.filters.get(tagnameTwo)(tag, internals)
            : internals.filters.get(tagnameZero)(tag, internals)
    }

    filterApi.register(tagname, fourWayFilter)
}
