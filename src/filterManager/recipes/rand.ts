import type {
    Tag
} from '../../tags'

import type {
    FilterApi
} from '../filters'

import {
    allowCommaStyle,
    toNumbers,
} from './utils'

const intGenerator = function*(min: number, max: number, presetValues: number[], filter = false): Generator<number, void, void>  {
    const searchDomain: number[] = presetValues
    ? [...presetValues]
    : [...Array(max - min + 1).keys()]
    .map(v => v + min)

    const maxTries = 100
    let tries = 0

    while (searchDomain.length > 0 && tries < maxTries) {
        const index = presetValues
            ? 0
            : Math.floor(Math.random() * searchDomain.length)

        yield filter || presetValues
        // removes value from search domain
            ? searchDomain.splice(index, 1)[0]
            : searchDomain[index]

        tries++
    }
}

const realGenerator = function*(min: number, max: number, presetValues: number[]): Generator<number, void, void>  {
    const maxTries = 100
    let tries = 0

    const searchDomain: number[] = presetValues
        ? [...presetValues]
        : []

    while (tries < maxTries && (!presetValues || searchDomain.length > 0)) {
        const value = presetValues
            ? searchDomain.splice(0, 1)[0]
            : (Math.random() * (max - min) + min)

        yield value
        tries++
    }
}

const randRecipe = (
    keyword: string,
) => (filterApi: FilterApi) => {
    const intFilter = (
        {num, values, valuesRaw}: Tag,
    ) => {
        const [
            min = 1,
            max = null,
            multiple = 1,
        ] = toNumbers(allowCommaStyle(values, valuesRaw))


        return min > max
            ? String(0)
            : String((min + Math.floor(Math.random() * max - min)) * multiple)
    }

    const realFilter = (
        {num, values, valuesRaw}
    ) => {
        const [
            min = 1,
            max = null,
            multiple = 1,
        ] = toNumbers(allowCommaStyle(values, valuesRaw))
    }

    filterApi.register(keyword, intFilter)
    // filterApi.register(`${keyword}r`, realFilter)
}

export default randRecipe
