import type { TagNode, Registrar, Eval, Internals, Recipe, WrapOptions } from './types'

import { defaultTagnameGetter, defaultTagnameSetter } from './wrappers'

export const sum = <T extends {}>(
    recipeFalse: Recipe<T>,
    recipeTrue: Recipe<T>,
    predicate: Eval<T, boolean>, {
        wrapId,
        setTagnames,
    }: WrapOptions = {
        wrapId: 'sum',
        getTagnames: defaultTagnameGetter,
        setTagnames: defaultTagnameSetter,
    },
): Recipe<T> => ({
    tagname = 'sum',

    optionsFalse = {},
    optionsTrue = {},
}: {
    tagname?: string,

    optionsTrue?: object,
    optionsFalse?: object,
} = {}) => (registrar: Registrar<T>) => {
    const tagnameTrue = `${tagname}:${wrapId}:true`
    const tagnameFalse = `${tagname}:${wrapId}:false`

    setTagnames(optionsTrue, [tagnameTrue])
    setTagnames(optionsFalse, [tagnameFalse])

    recipeTrue(optionsTrue)(registrar)
    recipeFalse(optionsFalse)(registrar)

    const sumFilter = (
        tag: TagNode,
        internals: Internals<T>,
    ) => {
        return predicate(tag, internals)
            ? internals.filters.getOrDefault(tagnameTrue)(tag, internals)
            : internals.filters.getOrDefault(tagnameFalse)(tag, internals)
    }

    registrar.register(tagname, sumFilter, registrar.getOptions(tagnameTrue /* have to be same for True/False */))
}

export const sumFour = <T extends {}>(
    recipeZero: Recipe<T>,
    recipeOne: Recipe<T>,
    recipeTwo: Recipe<T>,
    recipeThree: Recipe<T>,
    predicateOne: Eval<T, boolean>,
    predicateTwo: Eval<T, boolean>, {
        wrapId,
        setTagnames,
    }: WrapOptions = {
        wrapId: 'sumFour',
        getTagnames: defaultTagnameGetter,
        setTagnames: defaultTagnameSetter,
    },
): Recipe<T> => ({
    tagname = 'sum',

    optionsZero = {},
    optionsOne = {},
    optionsTwo = {},
    optionsThree = {},

}: {
    tagname?: string,

    optionsThree?: object,
    optionsTwo?: object,
    optionsOne?: object,
    optionsZero?: object,

    setTagname?: (options: object, newName: string) => void,
} = {}) => (registrar: Registrar<T>) => {
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
        tag: TagNode,
        internals: Internals<T>,
    ) => {
        return predicateTwo(tag, internals)
            ? internals.filters.getOrDefault(tagnameTwo)(tag, internals)
            : internals.filters.getOrDefault(tagnameZero)(tag, internals)
    }

    registrar.register(tagname, sumFourFilter)
}
