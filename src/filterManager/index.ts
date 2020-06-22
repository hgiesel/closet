import {
    Storage,
    StorageType,
} from './storage'

import type {
    Filterable,
    FilterResult,
    Readiable,
} from './filters'

import {
    FilterApi,
} from './filters'


import {
    DeferredApi,
} from './deferred'

export interface ManagerInfo<T,I,R extends Readiable,D extends object> {
    filters: FilterApi<R,D>

    cache: Storage
    memory: Storage
    environment: Storage

    deferred: DeferredApi<ManagerInfo<T,I,R,D> & T & I>
    aftermath: DeferredApi<ManagerInfo<T,I,R,D> & T>

    preset: object
}

type FilterProcessor<R,D> = (data: Filterable<D>, r: R) => FilterResult

export class MetaFilterManager<T,I,R extends Readiable, D extends object> {
    readonly filters: FilterApi<R,D>

    private readonly deferred: DeferredApi<ManagerInfo<T,I,R,D> & T & I>
    private readonly aftermath: DeferredApi<ManagerInfo<T,I,R,D> & T>

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

    private getAftermathInternals(t: T): ManagerInfo<T,I,R,D> & T {
        return Object.assign({}, {
            filters: this.filters,

            cache: this.cache,
            memory: this.memory,
            environment: this.environment,

            deferred: this.deferred,
            aftermath: this.aftermath,

            preset: this.preset,
        }, t)
    }

    private getDeferredInternals(t: T, i: I): ManagerInfo<T,I,R,D> & T & I {
        return Object.assign(this.getAftermathInternals(t), i)
    }

    private getInternals(t: T, i: I, r: R): ManagerInfo<T,I,R,D> & T & I & R {
        return Object.assign(this.getDeferredInternals(t, i), r)
    }

    filterProcessor(t: T, i: I): FilterProcessor<R,D> {
        return (data: Filterable<D>, r: R): FilterResult => {
            return this.filters.execute(data, this.getInternals(t, i, r))
        }
    }

    executeDeferred(t: T, i: I) {
        this.deferred.executeEach(this.getDeferredInternals(t, i))
    }

    executeAftermath(t: T) {
        this.aftermath.executeEach(this.getAftermathInternals(t))
    }

    clearMemory() {
        this.memory.clear()
        this.aftermath.clear()
    }

    reset() {
        this.cache.clear()
        this.deferred.clear()
    }

    addRecipe(recipe: (filters: FilterApi<R,D>) => void): void {
        recipe(this.filters)
    }
}
