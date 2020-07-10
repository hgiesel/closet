import type { TagData, Registrar, Eval, Internals, Recipe, WrapOptions } from './types'

import { defaultTagnameGetter, defaultTagnameSetter } from './wrappers'

export const sum = <T extends object, U extends object>(
    recipeFalse: Recipe<T>,
    recipeTrue: Recipe<U>,
    predicate: Eval<T & U, boolean>, {
        wrapId,
        setTagnames,
    }: WrapOptions = {
        wrapId: 'sum',
        getTagnames: defaultTagnameGetter,
        setTagnames: defaultTagnameSetter,
    },
): Recipe<T & U> => ({
    tagname = 'sum',

    optionsFalse = {},
    optionsTrue = {},
}: {
    tagname?: string,

    optionsTrue?: object,
    optionsFalse?: object,
} = {}) => (registrar: Registrar<T & U>) => {
    const tagnameTrue = `${tagname}:${wrapId}:true`
    const tagnameFalse = `${tagname}:${wrapId}:false`

    setTagnames(optionsTrue, [tagnameTrue])
    setTagnames(optionsFalse, [tagnameFalse])

    recipeTrue(optionsTrue)(registrar)
    recipeFalse(optionsFalse)(registrar)

    const sumFilter = (
        tag: TagData,
        internals: Internals<T & U>,
    ) => {
        return predicate(tag, internals)
            ? internals.filters.getOrDefault(tagnameTrue)(tag, internals)
            : internals.filters.getOrDefault(tagnameFalse)(tag, internals)
    }

    registrar.register(tagname, sumFilter, registrar.getOptions(tagnameTrue /* have to be same for True/False */))
}

export const sumFour = <T extends object, U extends object, V extends object, W extends object>(
    recipeZero: Recipe<T>,
    recipeOne: Recipe<U>,
    recipeTwo: Recipe<V>,
    recipeThree: Recipe<W>,
    predicateOne: Eval<T & U & V & W, boolean>,
    predicateTwo: Eval<T & U & V & W, boolean>, {
        wrapId,
        setTagnames,
    }: WrapOptions = {
        wrapId: 'sumFour',
        getTagnames: defaultTagnameGetter,
        setTagnames: defaultTagnameSetter,
    },
): Recipe<T & U & V & W> => ({
    tagname = 'sum',

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
    const tagnameZero = `${tagname}:${wrapId}:zero`
    const tagnameTwo = `${tagname}:${wrapId}:two`

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
            ? internals.filters.getOrDefault(tagnameTwo)(tag, internals)
            : internals.filters.getOrDefault(tagnameZero)(tag, internals)
    }

    registrar.register(tagname, sumFourFilter)
}
