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
    filters: FilterApi

    preset: object
    iteration: IterationInfo
    round: RoundInfo

    cache: Storage
    memory: Storage

    deferred: DeferredApi
    aftermath: DeferredApi
}

export interface IterationInfo {
    template: TemplateApi
    iteration: { index: number }
    baseDepth: number
}

export interface RoundInfo {
    ready: boolean
    depth: number
}

export type FilterProcessor = (data: Filterable, custom?: object) => FilterResult

export class FilterManager {
    readonly filters: FilterApi

    private readonly deferred: DeferredApi
    private readonly aftermath: DeferredApi

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

    filterProcessor(iteration: IterationInfo): FilterProcessor {
        return (data: Filterable, round: RoundInfo): FilterResult => {
            const internals: Internals = {
                filters: this.filters,

                preset: this.preset,
                iteration: iteration,
                round: round,

                cache: this.cache,
                memory: this.memory,

                deferred: this.deferred,
                aftermath: this.aftermath,
            }

            const result = this.filters.execute(data, internals)
            return result
        }
    }

    executeDeferred() {
        this.deferred.executeEach()
    }

    executeAftermath() {
        this.aftermath.executeEach()
    }

    clearMemory() {
        this.memory.clear()
        this.aftermath.clear()
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
