import type {
    Tag,
    TagInfo,
    TagApi,
} from '../tags'

import {
    Memoizer,
    defaultMemoizer,
    generateMemoizerKey,
} from './memoizer'

import {
    Store,
} from './store'

import {
    FilterApi,
} from './filters'

import {
    executeFilter,
} from './iteration'

import {
    DeferredApi,
} from './deferred'

export interface Internals {
    store: Store
    filters: FilterApi
    deferred: DeferredApi
    custom: object
    tag: TagApi
}

interface FilterResult2 {
    result: string | null
    ready: boolean
}

export class FilterManager {
    readonly filters: FilterApi
    private readonly deferred: DeferredApi

    private readonly custom: object
    private readonly store: Store

    private readonly memoizer: Memoizer

    constructor(custom = {}, memoizer = defaultMemoizer) {
        this.filters = new FilterApi()
        this.deferred = new DeferredApi()

        this.custom = custom
        this.store = new Store()

        this.memoizer = memoizer
    }

    private processFilter(key: string, data: Tag, tagApi: TagApi): FilterResult2 {
        const memoizerKey = generateMemoizerKey(data)

        if (this.memoizer.hasItem(memoizerKey)) {
            return {
                result: this.memoizer.getItem(memoizerKey).result,
                ready: true,
            }
        }

        const internals: Internals = {
            custom: this.custom,
            store: this.store,
            filters: this.filters,
            deferred: this.deferred,
            tag: tagApi,
        }

        const result = executeFilter(this.filters.getOrDefault(key), data, internals)

        if (!result) {
            return {
                result: null,
                ready: false,
            }
        }

        if (result.memoize) {
            this.memoizer.setItem(memoizerKey, result)
        }

        return {
            result: result.result,
            ready: true,
        }
    }

    *iterations(rootTag: TagInfo) {
        while (!rootTag.isReadyRecursive()) {
            yield this.processFilter

            this.deferred.forEach()
            this.deferred.clear()
        }
    }

    addRecipe(recipe: (filters: FilterApi) => void): void {
        recipe(this.filters)
    }
}

export default mkFilterManager
