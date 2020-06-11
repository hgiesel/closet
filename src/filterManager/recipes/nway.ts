import type { Tag, FilterApi, Internals, Recipe } from './types'

export const twoWayRecipe: Recipe = ({
    tagname,
    predicate,

    recipeTrue,
    recipeFalse,

    optionsTrue,
    optionsFalse,

    setTagname = (options, newName) => options['tagname'] = newName,
}: {
    tagname: string,
    predicate: (t: Tag, inter: Internals) => boolean,

    recipeTrue: Recipe,
    recipeFalse: Recipe,

    optionsTrue: object,
    optionsFalse: object,

    setTagname: (options: object, newName: string) => void,
}) => (filterApi: FilterApi) => {
    const tagnameTrue = `${tagname}:twoWay:true`
    const tagnameFalse = `${tagname}:twoWay:false`

    setTagname(optionsTrue, tagnameTrue)
    setTagname(optionsFalse, tagnameFalse)

    recipeTrue(optionsTrue)(filterApi)
    recipeFalse(optionsFalse)(filterApi)

    const twoWayFilter = (
        tag: Tag,
        internals: Internals,
    ) => {
        return predicate(tag, internals)
            ? internals.filters.get(tagnameTrue)(tag, internals)
            : internals.filters.get(tagnameFalse)(tag, internals)
    }

    filterApi.register(tagname, twoWayFilter)
}

export const fourWayRecipe: Recipe = ({
    tagname,
    predicateTwo,
    predicateOne,

    recipeThree,
    recipeTwo,
    recipeOne,
    recipeZero,

    optionsThree,
    optionsTwo,
    optionsOne,
    optionsZero,

    setTagname = (options, newName) => options['tagname'] = newName,
}: {
    tagname: string,
    predicateOne: (t: Tag, inter: Internals) => boolean,
    predicateTwo: (t: Tag, inter: Internals) => boolean,

    recipeThree: Recipe,
    recipeTwo: Recipe,
    recipeOne: Recipe,
    recipeZero: Recipe,

    optionsThree: object,
    optionsTwo: object,
    optionsOne: object,
    optionsZero: object,

    setTagname: (options: object, newName: string) => void,
}) => (filterApi: FilterApi) => {
    const tagnameZero = `${tagname}:fourWay:zero`
    const tagnameTwo = `${tagname}:fourWay:two`

    setTagname(optionsZero, tagnameZero)
    setTagname(optionsOne, tagnameZero)

    twoWayRecipe({
        tagname: tagnameZero,
        predicate: predicateOne,

        recipeTrue: recipeOne,
        recipeFalse: recipeZero,

        optionsTrue: optionsOne,
        optionsFalse: optionsZero,
    })(filterApi)

    setTagname(optionsTwo, tagnameTwo)
    setTagname(optionsThree, tagnameTwo)

    twoWayRecipe({
        tagname: tagnameTwo,
        predicate: predicateOne,

        recipeTrue: recipeThree,
        recipeFalse: recipeTwo,

        optionsTrue: optionsThree,
        optionsFalse: optionsTwo,
    })(filterApi)

    const fourWayFilter = (
        tag: Tag,
        internals: Internals,
    ) => {
        return predicateTwo(tag, internals)
            ? internals.filters.get(tagnameTwo)(tag, internals)
            : internals.filters.get(tagnameZero)(tag, internals)
    }

    filterApi.register(tagname, fourWayFilter)
}
