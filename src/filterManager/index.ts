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

export interface ManagerInfo<F extends Filterable, T,I,R extends Readiable, X, D extends object, P extends object> {
    filters: FilterApi<F, ManagerInfo<F,T,I,R,X,D,P> & T & I & R>
    options: Storage<Partial<D>>
    registrar: RegistrarApi<F, ManagerInfo<F,T,I,R,X,D,P> & T & I & R, D>

    cache: Storage<unknown>
    memory: Storage<unknown>
    environment: Storage<unknown>

    deferred: DeferredApi<ManagerInfo<F,T,I,R,X,D,P> & T & I>
    aftermath: DeferredApi<ManagerInfo<F,T,I,R,X,D,P> & T & X>

    preset: P
}

interface FilterAccessor<F,T,D> {
    getProcessor: (name: string) => FilterProcessor<F,T,D>
}

interface FilterProcessor<F,T,D> {
    execute: (data: F, r: T) => FilterResult
    getOptions: () => Partial<D>
}

interface ClosetEnvironment {
    closetEnvironment: Storage<unknown>
}

export class MetaFilterManager<
    F extends Filterable,
    T,
    I,
    R extends Readiable,
    X extends object,
    D extends object,
    P extends object,
> {
    protected readonly filters: FilterApi<F, ManagerInfo<F,T,I,R,X,D,P> & T & I & R>
    protected readonly options: Storage<Partial<D>>

    readonly registrar: RegistrarApi<F, ManagerInfo<F,T,I,R,X,D,P> & T & I & R, D>

    protected readonly deferred: DeferredApi<ManagerInfo<F,T,I,R,X,D,P> & T & I>
    protected readonly aftermath: DeferredApi<ManagerInfo<F,T,I,R,X,D,P> & T & X>

    protected readonly cache: Storage<unknown>
    protected readonly memory: Storage<unknown>
    protected readonly environment: Storage<unknown>

    protected preset: P

    constructor(memory: StorageType<unknown> = new Map(), preset: P) {
        this.preset = preset

        this.filters = new FilterApi()
        this.options = new Storage(new Map())

        this.registrar = new RegistrarApi(this.filters, this.options)

        this.deferred = new DeferredApi()
        this.aftermath = new DeferredApi()

        this.cache = new Storage(new Map())
        this.memory = new Storage(memory)

        if (!globalThis.hasOwnProperty('closetEnvironment')) {
            (globalThis as typeof globalThis & Partial<ClosetEnvironment>).closetEnvironment = new Storage(new Map())
        }

        this.environment = (globalThis as typeof globalThis & ClosetEnvironment).closetEnvironment
    }

    protected getBaseInternals(t: T): ManagerInfo<F,T,I,R,X,D,P> & T {
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

    protected getAftermathInternals(t: T, x: X): ManagerInfo<F,T,I,R,X,D,P> & T & X {
        return Object.assign(this.getBaseInternals(t), x)
    }

    protected getDeferredInternals(t: T, i: I): ManagerInfo<F,T,I,R,X,D,P> & T & I {
        return Object.assign(this.getBaseInternals(t), i)
    }

    protected getInternals(t: T, i: I, r: R): ManagerInfo<F,T,I,R,X,D,P> & T & I & R {
        return Object.assign(this.getDeferredInternals(t, i), r)
    }

    filterAccessor(t: T, i: I): FilterAccessor<F, ManagerInfo<F,T,I,R,X,D,P> & T & I & R, D> {
        return {
            getProcessor: (name: string): FilterProcessor<F, ManagerInfo<F,T,I,R,X,D,P> & T & I & R, D> => {
                return {
                    execute: (data: F, r: R): FilterResult => this.filters.execute(name, data, this.getInternals(t, i, r)),
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

    addRecipe(recipe: (registrar: RegistrarApi<F, ManagerInfo<F,T,I,R,X,D,P> & T & I & R, D>) => void): void {
        recipe(this.registrar)
    }

    setPreset(preset: P) {
        this.preset = preset
    }
}
