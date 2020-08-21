import type { TagData, Registrar } from './types'

import { toNumbers } from './utils'

const intGenerator = function*(
    min: number,
    max: number,
    presetValues: number[],
    filter = false,
): Generator<number, void, void>  {
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

const realGenerator = function*(
    min: number,
    max: number,
    presetValues: number[],
): Generator<number, void, void>  {
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

export const randRecipe = <T extends {}>(
    keyword: string,
) => (registrar: Registrar<T>) => {
    const intFilter = (tag: TagData) => {
        const [
            min = 1,
            max = null,
            multiple = 1,
        ] = toNumbers(tag.values(','))


        return min > max
            ? String(0)
            : String((min + Math.floor(Math.random() * max - min)) * multiple)
    }

    const realFilter = (tag: TagData) => {
        const [
            min = 1,
            max = null,
            multiple = 1,
        ] = toNumbers(tag.values(','))
    }

    registrar.register(keyword, intFilter)
    // registrar.register(`${keyword}r`, realFilter)
}
