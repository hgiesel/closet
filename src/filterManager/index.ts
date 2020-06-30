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

type PartialObject<T> = Partial<T>

export interface ManagerInfo<T,I,R extends Readiable, D extends object, P extends object> {
    filters: FilterApi<R,D>

    cache: Storage
    memory: Storage
    environment: Storage

    deferred: DeferredApi<ManagerInfo<T,I,R,D,P> & T & I>
    aftermath: DeferredApi<ManagerInfo<T,I,R,D,P> & T>

    preset: PartialObject<P>
}

interface FilterAccessor<R,D> {
    getProcessor: (name: string) => FilterProcessor<R,D>
}

interface FilterProcessor<R,D> {
    execute: (data: Filterable<D>, r: R) => FilterResult
    options: Partial<D>
}

export class MetaFilterManager<T,I,R extends Readiable, D extends object, P extends object> {
    readonly filters: FilterApi<R,D>

    private readonly deferred: DeferredApi<ManagerInfo<T,I,R,D,P> & T & I>
    private readonly aftermath: DeferredApi<ManagerInfo<T,I,R,D,P> & T>

    private readonly cache: Storage
    private readonly memory: Storage
    private readonly environment: Storage

    private preset: PartialObject<P>

    constructor(memory: StorageType = new Map()) {
        this.preset = {}

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

    private getAftermathInternals(t: T): ManagerInfo<T,I,R,D,P> & T {
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

    private getDeferredInternals(t: T, i: I): ManagerInfo<T,I,R,D,P> & T & I {
        return Object.assign(this.getAftermathInternals(t), i)
    }

    private getInternals(t: T, i: I, r: R): ManagerInfo<T,I,R,D,P> & T & I & R {
        return Object.assign(this.getDeferredInternals(t, i), r)
    }

    filterAccessor(t: T, i: I): FilterAccessor<R,D> {
        return {
            getProcessor: (name: string): FilterProcessor<R,D> => {
                const options = this.filters.getOrDefaultOptions(name)

                return {
                    execute: (data: Filterable<D>, r: R): FilterResult => {
                        return this.filters.execute(name, data, this.getInternals(t, i, r))
                    },
                    options: options,
                }
            },
        }
    }

    executeDeferred(t: T, i: I) {
        this.deferred.executeEach(this.getDeferredInternals(t, i))
    }

    executeAftermath(t: T) {
        this.aftermath.executeEach(this.getAftermathInternals(t))
    }

    clear() {
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

    setPreset(preset: PartialObject<P> = {}) {
        this.preset = preset
    }
}
