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

export interface IterationInternals {
    template: TemplateApi,
    iteration: { index: number }
    baseDepth: number,
}

export interface RoundInternals {
    ready: boolean
    depth: number,
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

    filterProcessor(iteration: IterationInternals): FilterProcessor {
        return (data: Filterable, round: RoundInternals): FilterResult => {
            const internals: Internals = Object.assign(this.preset, iteration, round, {
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
