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
    registrar: RegistrarApi<R, Partial<D>>

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
    getOptions: () => Partial<D>
}

export class MetaFilterManager<T,I,R extends Readiable, X extends object, D extends object, P extends object> {
    protected readonly filters: FilterApi<R>
    protected readonly options: Storage<Partial<D>>

    readonly registrar: RegistrarApi<R, Partial<D>>

    protected readonly deferred: DeferredApi<ManagerInfo<T,I,R,D,P> & T & I>
    protected readonly aftermath: DeferredApi<ManagerInfo<T,I,R,D,P> & T & X>

    protected readonly cache: Storage<unknown>
    protected readonly memory: Storage<unknown>
    protected readonly environment: Storage<unknown>

    protected preset: Partial<P>

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

    private getBaseInternals(t: T): ManagerInfo<T,I,R,D,P> & T {
        return Object.assign({}, {
            filters: this.filters,
            options: this.options,
            registrar: this.registrar,

            cache: this.cache,
            memory: this.memory,
            environment: this.environment,

            deferred: this.deferred,
            aftermath: this.aftermath,

            preset: this.preset,
        }, t)
    }

    private getAftermathInternals(t: T, x: X): ManagerInfo<T,I,R,D,P> & T & X {
        return Object.assign(this.getBaseInternals(t), x)
    }

    private getDeferredInternals(t: T, i: I): ManagerInfo<T,I,R,D,P> & T & I {
        return Object.assign(this.getBaseInternals(t), i)
    }

    private getInternals(t: T, i: I, r: R): ManagerInfo<T,I,R,D,P> & T & I & R {
        return Object.assign(this.getDeferredInternals(t, i), r)
    }

    filterAccessor(t: T, i: I): FilterAccessor<R,D> {
        return {
            getProcessor: (name: string): FilterProcessor<R,D> => {
                return {
                    execute: (data: Filterable, r: R): FilterResult => this.filters.execute(name, data, this.getInternals(t, i, r)),
                    getOptions: () => this.options.get(name, {}),
                }
            },
        }
    }

    executeDeferred(t: T, i: I) {
        const deferredInternals = this.getDeferredInternals(t, i)
        this.deferred.executeEach(deferredInternals)
    }

    executeAftermath(t: T, x: X) {
        const aftermathInternals = this.getAftermathInternals(t, x)
        this.aftermath.executeEach(aftermathInternals)
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
