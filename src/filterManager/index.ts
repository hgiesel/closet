import type TemplateApi from '../template'

import {
    Storage,
    StorageType,
} from './storage'

import {
    FilterApi,
    Filterable,
    FilterResult,
} from './filters'

import {
    DeferredApi,
} from './deferred'

export interface Internals {
    cache: Storage,
    memory: Storage,
    filters: FilterApi
    deferred: DeferredApi
    iteration: {index: number }
    ready: boolean
}

export interface StockInternals {
    template: TemplateApi,
    iteration: { index: number }
}

export interface CustomInternals {
    ready: boolean
}

export type FilterProcessor = (data: Filterable, custom?: object) => FilterResult

export class FilterManager {
    readonly filters: FilterApi
    private readonly deferred: DeferredApi

    private readonly cache: Storage
    private readonly memory: Storage

    private readonly preset: object

    constructor(preset = {}, memory: StorageType = new Map()) {
        this.filters = new FilterApi()
        this.deferred = new DeferredApi()

        this.preset = preset
        this.cache = new Storage(new Map())
        this.memory = new Storage(memory)
    }

    filterProcessor(stock: StockInternals): FilterProcessor {
        return (data: Filterable, custom: CustomInternals): FilterResult => {
            const internals: Internals = Object.assign(this.preset, stock, custom, {
                cache: this.cache,
                memory: this.memory,
                filters: this.filters,
                deferred: this.deferred,
            })

            const result = this.filters.execute(data, internals)
            return result
        }
    }

    executeDeferred() {
        this.deferred.executeEach()
    }

    clearMemory() {
        this.memory.clear()
    }

    reset() {
        this.cache.clear()
        this.deferred.clear()
    }

    addRecipe(recipe: (filters: FilterApi) => void): void {
        recipe(this.filters)
    }
}

export default FilterManager
