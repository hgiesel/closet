import type {
    FilterApi
} from '../filters'

import {
    Internals,
} from '..'

import type { Tag } from '../../tags'

const mixRecipe = (keyword: string, separator: string) => (filterApi: FilterApi) => {
    const shuffle = (array: unknown[]) => {
        const result = array.slice(0)
        let currentIndex = array.length, temporaryValue = null, randomIndex = null

        // While there remain elements to shuffle...
        while (currentIndex !== 0) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex)
            currentIndex -= 1

            // And swap it with the current element.
            temporaryValue = result[currentIndex]
            result[currentIndex] = result[randomIndex]
            result[randomIndex] = temporaryValue
        }

        return result
    }

    const mixPrepareFilter = (
        {fullKey, key, idx, values}: Tag,
        {store, filters, deferred, ready}: any,
    ) => {
        if (!ready) {
            return
        }

        if (idx === null) {
            return shuffle(values[0]).join(separator)
        }

        if (store.has(fullKey)) {
            store.over(fullKey, (v: unknown[]) => v.concat(values[0]))
        }
        else {
            store.set(fullKey, values[0])
        }

        const replaceKey = `replaceFilter:${key}`
        if (!deferred.has(replaceKey)) {
            deferred.register(replaceKey, () => filters.register(key, mixApplyFilter as any))
        }

        const mixKey = `mix:${fullKey}`
        if (!deferred.has(mixKey)) {
            deferred.register(`mix:${fullKey}`, () => store.over(fullKey, shuffle))
        }

        // TODO
        // nextIteration.activate()
    }

    const mixApplyFilter = (
        {fullKey, values}: Tag,
        {store}: Internals,
    ) => {
        const popped = []
        for (let x = 0; x < values[0].length; x++) {
            popped.push((store.get(fullKey, []) as unknown[]).shift())
        }

        return popped.join(separator)
    }

    filterApi.register(keyword, mixPrepareFilter as any)
}

export default mixRecipe
