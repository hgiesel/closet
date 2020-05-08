import type {
    Tag,
} from '../../types'

import type {
    TagApi,
} from '../types'

import type {
    Internals,
    FilterManager,
    FilterResult,
    Iteration,
    NextIterationApi,
    FilterApi,
} from './types'


import {
    defaultMemoizer,
    generateMemoizerKey,
} from './memoizer'

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

const mkFilterManager = (custom = {}, memoizer = defaultMemoizer): FilterManager => {
    const store = mkStoreApi(new Map())
    const filters = mkFilterApi(new Map())
    const deferred = mkDeferredApi(new Map())

    let nextIteration: boolean = true
    const nextIterationApi: NextIterationApi = {
        activate: (value = true) => {
            nextIteration = value
        },
        isActivated: () => nextIteration,
    }

    const processFilter = (key: string, data: Tag, tagApi: TagApi): FilterResult => {
        const memoizerKey = generateMemoizerKey(data)

        if (memoizer.hasItem(memoizerKey)) {
            return memoizer.getItem(memoizerKey)
        }

        const internals: Internals = {
            custom: custom,
            nextIteration: nextIterationApi,
            store: store,
            filters: filters,
            deferred: deferred,
            tag: tagApi,
        }

        const result = executeFilter(filters.getOrDefault(key), data, internals)

        if (result.memoize) {
            memoizer.setItem(memoizerKey, result)
        }

        return result
    }

    const addRecipe = (recipe: (filters: FilterApi) => void): void => {
        recipe(filters)
    }

    const iterations = function*() {
        while (nextIteration) {
            nextIteration = false

            yield {
                processFilter: processFilter,
            }

            deferred.forEach()
            deferred.clear()
        }
    }

    return {
        filters: filters,
        addRecipe: addRecipe,
        iterations: iterations,
    }
}

export default mkFilterManager
