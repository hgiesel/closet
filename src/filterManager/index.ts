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
    iteration: IterationInfo | null
    round: RoundInfo | null

    cache: Storage
    memory: Storage
    environment: Storage

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
    private readonly environment: Storage

    private readonly preset: object

    constructor(preset = {}, memory: StorageType = new Map()) {
        this.preset = preset

        this.filters = new FilterApi()

        this.deferred = new DeferredApi()
        this.aftermath = new DeferredApi()

        this.cache = new Storage(new Map())
        this.memory = new Storage(memory)

        if (!globalThis.closetEnvironment) {
            globalThis.closetEnvironment = new Storage(new Map())
        }

        this.environment = globalThis.closetEnvironment
    }

    private getInternals(iteration: IterationInfo = null, round: RoundInfo = null): Internals {
        return {
            filters: this.filters,

            preset: this.preset,
            iteration: iteration,
            round: round,

            cache: this.cache,
            memory: this.memory,
            environment: this.environment,

            deferred: this.deferred,
            aftermath: this.aftermath,
        }
    }

    filterProcessor(iteration: IterationInfo): FilterProcessor {
        return (data: Filterable, round: RoundInfo): FilterResult => {
            const result = this.filters.execute(data, this.getInternals(iteration, round))
            return result
        }
    }

    executeDeferred(iteration: IterationInfo) {
        this.deferred.executeEach(this.getInternals(iteration))
    }

    executeAftermath() {
        this.aftermath.executeEach(this.getInternals())
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
