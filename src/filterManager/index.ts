import {
    Memoizer,
    MemoizerKeyable,
    defaultMemoizer,
} from './memoizer'

import {
    Store,
} from './store'

import {
    FilterApi,
    Filterable,
} from './filters'

import {
    DeferredApi,
} from './deferred'


export interface Internals {
    store: Store
    filters: FilterApi
    deferred: DeferredApi
}

interface FilterProcessorResult {
    result: string | null
    ready: boolean
}

export type FilterProcessor = (data: Filterable & MemoizerKeyable) => FilterProcessorResult

export class FilterManager {
    readonly filters: FilterApi
    private readonly deferred: DeferredApi

    private readonly store: Store
    private readonly memoizer: Memoizer

    constructor(memoizer = defaultMemoizer) {
        this.filters = new FilterApi()
        this.deferred = new DeferredApi()

        this.store = new Store()

        this.memoizer = memoizer
    }

    filterProcessor(extension: object): FilterProcessor {
        return (data: Filterable & MemoizerKeyable): FilterProcessorResult => {

            if (this.memoizer.hasItem(data)) {
                return {
                    result: this.memoizer.getItem(data).result,
                    ready: true,
                }
            }

            const internals: Internals = Object.assign(extension, {
                store: this.store,
                filters: this.filters,
                deferred: this.deferred,
            })

            const result = this.filters.execute(data, internals)

            if (!result) {
                return {
                    result: null,
                    ready: false,
                }
            }

            if (result.memoize) {
                this.memoizer.setItem(data, result)
            }

            return {
                result: result.result,
                ready: true,
            }
        }
    }

    executeAndClearDeferred() {
        this.deferred.executeEach()
        this.deferred.clear()
    }

    addRecipe(recipe: (filters: FilterApi) => void): void {
        recipe(this.filters)
    }
}

export default mkFilterManager
