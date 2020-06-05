import type { Tag } from '../../tags'
import type { FilterApi } from '../filters'
import type { Internals } from '..'

export const twoWayRecipe = (
    keyword: string,
    predicateOne: (t: Tag, inter: Internals) => boolean,

    processorOne: (t: Tag, inter: Internals) => string,
    processorNone: (t: Tag, inter: Internals) => string,
) => (filterApi: FilterApi) => {
    const clozeFilter = (
        tag: Tag,
        inter: Internals,
    ) => {
        const propertyOne = predicateOne(tag, inter)

        let result = null

        if (propertyOne) {
            result = processorOne(tag, inter)
        }
        else {
            result = processorNone(tag, inter)
        }

        return result
    }

    filterApi.register(keyword, clozeFilter)
}

export const fourWayRecipe = (
    keyword: string,
    predicateOne: (t: Tag, inter: Internals) => boolean,
    predicateTwo: (t: Tag, inter: Internals) => boolean,

    processorOneTwo: (t: Tag, inter: Internals) => string,
    processorOne: (t: Tag, inter: Internals) => string,
    processorTwo: (t: Tag, inter: Internals) => string,
    processorNone: (t: Tag, inter: Internals) => string,
) => (filterApi: FilterApi) => {
    const clozeFilter = (
        tag: Tag,
        inter: Internals,
    ) => {
        const propertyOne = predicateOne(tag, inter)
        const propertyTwo = predicateTwo(tag, inter)

        let result = null

        if (propertyOne && propertyTwo) {
            console.log('hit1')
            result = processorOneTwo(tag, inter)
        }
        else if (propertyOne) {
            console.log('hit2')
            result = processorOne(tag, inter)
        }
        else if (propertyTwo) {
            console.log('hit3')
            result = processorTwo(tag, inter)
        }
        else {
            console.log('hit4')
            result = processorNone(tag, inter)
        }

        return result
    }

    filterApi.register(keyword, clozeFilter)
}

export const eightWayRecipe = (
    keyword: string,
    predicateOne: (t: Tag, inter: Internals) => boolean,
    predicateTwo: (t: Tag, inter: Internals) => boolean,
    predicateThree: (t: Tag, inter: Internals) => boolean,

    processorOneTwoThree: (t: Tag, inter: Internals) => string,
    processorOneTwo: (t: Tag, inter: Internals) => string,
    processorOneThree: (t: Tag, inter: Internals) => string,
    processorTwoThree: (t: Tag, inter: Internals) => string,
    processorOne: (t: Tag, inter: Internals) => string,
    processorTwo: (t: Tag, inter: Internals) => string,
    processorThree: (t: Tag, inter: Internals) => string,
    processorNone: (t: Tag, inter: Internals) => string,
) => (filterApi: FilterApi) => {
    const clozeFilter = (
        tag: Tag,
        inter: Internals,
    ) => {
        const propertyOne = predicateOne(tag, inter)
        const propertyTwo = predicateTwo(tag, inter)
        const propertyThree = predicateThree(tag, inter)

        let result = null

        if (propertyOne && propertyTwo && propertyThree) {
            result = processorOneTwoThree(tag, inter)
        }
        else if (propertyOne && propertyTwo) {
            result = processorOneTwo(tag, inter)
        }
        else if (propertyOne && propertyThree) {
            result = processorOneThree(tag, inter)
        }
        else if (propertyTwo && propertyThree) {
            result = processorTwoThree(tag, inter)
        }
        else if (propertyOne) {
            result = processorOne(tag, inter)
        }
        else if (propertyTwo) {
            result = processorTwo(tag, inter)
        }
        else if (propertyThree) {
            result = processorThree(tag, inter)
        }
        else {
            result = processorNone(tag, inter)
        }

        return result
    }

    filterApi.register(keyword, clozeFilter)
}
