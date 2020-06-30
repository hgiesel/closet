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

import {
    RegistrarApi,
} from './registrar'

export interface ManagerInfo<T,I,R extends Readiable, D extends object, P extends object> {
    filters: FilterApi<R>
    options: Storage<Partial<D>>

    cache: Storage<unknown>
    memory: Storage<unknown>
    environment: Storage<unknown>

    deferred: DeferredApi<ManagerInfo<T,I,R,D,P> & T & I>
    aftermath: DeferredApi<ManagerInfo<T,I,R,D,P> & T>

    preset: Partial<P>
}

interface FilterAccessor<R,D> {
    getProcessor: (name: string) => FilterProcessor<R,D>
}

interface FilterProcessor<R,D> {
    execute: (data: Filterable, r: R) => FilterResult
    options: Partial<D>
}

export class MetaFilterManager<T,I,R extends Readiable, D extends object, P extends object> {
    private readonly filters: FilterApi<R>
    private readonly options: Storage<Partial<D>>

    readonly registrar: RegistrarApi<R, Partial<D>>

    private readonly deferred: DeferredApi<ManagerInfo<T,I,R,D,P> & T & I>
    private readonly aftermath: DeferredApi<ManagerInfo<T,I,R,D,P> & T>

    private readonly cache: Storage<unknown>
    private readonly memory: Storage<unknown>
    private readonly environment: Storage<unknown>

    private preset: Partial<P>

    constructor(memory: StorageType<unknown> = new Map()) {
        this.preset = {}

        this.filters = new FilterApi()
        this.options = new Storage(new Map())

        this.registrar = new RegistrarApi(this.filters, this.options)

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
            options: this.options,

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
                const options = this.options.get(name, {})

                return {
                    execute: (data: Filterable, r: R): FilterResult => {
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

    addRecipe(recipe: (registrar: RegistrarApi<R,D>) => void): void {
        recipe(this.registrar)
    }

    setPreset(preset: Partial<P> = {}) {
        this.preset = preset
    }
}
