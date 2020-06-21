import type { Template } from '../template'
import type { Parser } from '../parser'

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

export interface ManagerInfo {
    filters: FilterApi

    cache: Storage
    memory: Storage
    environment: Storage

    deferred: DeferredApi<DeferredInternals>
    aftermath: DeferredApi<AftermathInternals>

    preset: object
}

export interface TemplateInfo {
    template: Template
    parser: Parser
}

export interface IterationInfo {
    iteration: number
    baseDepth: number
}

export interface RoundInfo {
    ready: boolean
    depth: number
    path: number[]
}

export type Internals = ManagerInfo & TemplateInfo & IterationInfo & RoundInfo
export type DeferredInternals = ManagerInfo & TemplateInfo & IterationInfo
export type AftermathInternals = ManagerInfo & TemplateInfo

export type FilterProcessor = (data: Filterable, custom?: object) => FilterResult

export class FilterManager {
    readonly filters: FilterApi

    private readonly deferred: DeferredApi<DeferredInternals>
    private readonly aftermath: DeferredApi<AftermathInternals>

    private readonly cache: Storage
    private readonly memory: Storage
    private readonly environment: Storage

    private template: TemplateInfo
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

    private getAftermathInternals(): AftermathInternals {
        return Object.assign({}, {
            filters: this.filters,

            cache: this.cache,
            memory: this.memory,
            environment: this.environment,

            deferred: this.deferred,
            aftermath: this.aftermath,

            preset: this.preset,
        }, this.template)
    }

    private getDeferredInternals(iteration: IterationInfo): DeferredInternals {
        return Object.assign(this.getAftermathInternals(), iteration)
    }

    private getInternals(iteration: IterationInfo, round: RoundInfo): Internals {
        return Object.assign(this.getDeferredInternals(iteration), round)
    }

    setTemplateInfo(ti: TemplateInfo): void {
        this.template = ti
    }

    filterProcessor(iteration: IterationInfo): FilterProcessor {
        return (data: Filterable, round: RoundInfo): FilterResult => {
            const result = this.filters.execute(data, this.getInternals(iteration, round))
            return result
        }
    }

    executeDeferred(iteration: IterationInfo) {
        this.deferred.executeEach(this.getDeferredInternals(iteration))
    }

    executeAftermath() {
        this.aftermath.executeEach(this.getAftermathInternals())
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
