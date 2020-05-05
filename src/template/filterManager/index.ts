import type {
    Tag,
} from '../../templateTypes'

import type {
    Internals,
    FilterManager,
    FilterResult,
    Iteration,
} from './types'

import {
    defaultMemoizer,
    generateMemoizerKey,
} from './utils'

import {
    mkStoreApi,
} from './store'

import {
    executeFilter,
    mkFilterApi,
} from './filters'

import {
    mkDeferredApi,
} from './deferred'

const mkFilterManager = (memoizer = defaultMemoizer()): FilterManager => {
    const store = new Map()
    const storeApi = mkStoreApi(store)

    const filters = new Map()
    const filterApi = mkFilterApi(filters)

    const deferred = new Map()
    const deferredApi = mkDeferredApi(deferred)

    let nextIteration: boolean = true

    const iterateAgain = (value: boolean = true) => {
        nextIteration = Boolean(value)
    }

    const internals: Internals = {
        iterateAgain: iterateAgain,
        nextIteration: () => nextIteration,

        store: storeApi,
        filters: filterApi,
        deferred: deferredApi,
    }

    const processFilter = (key: string, data: Tag): FilterResult => {
        const memoizerKey = generateMemoizerKey(data)

        if (memoizer.hasItem(memoizerKey)) {
            return memoizer.getItem(memoizerKey)
        }

        const result = executeFilter(filters, key, data, internals)

        if (result.memoize) {
            memoizer.setItem(memoizerKey, result)
        }

        return result
    }

    const iterations = function*() {
        while (nextIteration) {
            nextIteration = false

            yield {
                processFilter: processFilter,
            }

            for (const [name,def] of deferred) {
                console.log(name, def)
                def()
            }

            deferred.clear()
        }
    }

    return {
        iterations: iterations,
        filters: filterApi,
    }
}

export default mkFilterManager
