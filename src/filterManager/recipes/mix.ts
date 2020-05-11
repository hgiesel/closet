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

    const mixFilter = (
        {fullKey, idx, fullOccur, values}: Tag,
        {store, deferred, ready, iteration}: any,
    ) => {
        console.log(fullKey, idx, values, iteration.index)
        const readyKey = `${fullKey}:ready`
        const applyKey = `${fullKey}:${fullOccur}:apply`

        if (store.get(applyKey, false)) {
            if (!store.get(readyKey, true)) {
                return
            }

            const popped = []
            for (let x = 0; x < values[0].length; x++) {
                popped.push((store.get(fullKey, []) as unknown[]).shift())
            }

            const result = popped.join(separator)
            return result
        }

        if (!ready) {
            store.set(readyKey, false)

            deferred.registerIfNotExists(readyKey, () => {
                store.set(readyKey, true)
            })

            return
        }

        if (!idx) {
            const result = shuffle(values[0]).join(separator)
            console.log('no idx result', result)
            return result
        }

        store.fold(fullKey, (v: unknown[]) => v.concat(values[0]), [])

        deferred.registerIfNotExists(applyKey, () => {
            store.set(applyKey, true)
        })

        const mixKey = `${fullKey}:mix`
        deferred.registerIfNotExists(mixKey, () => {
            store.fold(fullKey, shuffle, [])
        })
    }

    filterApi.register(keyword, mixFilter as any)
}

export default mixRecipe
