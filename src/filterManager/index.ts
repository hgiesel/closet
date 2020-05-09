import type {
    Tag,
    TagApi,
} from '../tags'

import {
    defaultMemoizer,
    generateMemoizerKey,
} from './memoizer'

import {
    Store,
} from './store'

import {
    FilterApi,
    FilterResult,
} from './filters'

import {
    executeFilter,
} from './iteration'

import {
    DeferredApi,
} from './deferred'

export interface Internals {
    nextIteration: NextIterationApi
    store: Store
    filters: FilterApi
    deferred: DeferredApi
    custom: object
    tag: TagApi
}

export interface NextIterationApi {
    activate(v?: boolean): void
    isActivated(): boolean
}

export interface FilterManager {
    filters: FilterApi,
    addRecipe: any,
    iterations: any,
}

const mkFilterManager = (custom = {}, memoizer = defaultMemoizer): FilterManager => {
    const store = new Store()
    const filters = new FilterApi()
    const deferred = new DeferredApi()

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

            yield processFilter

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
