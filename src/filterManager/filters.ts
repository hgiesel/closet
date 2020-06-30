export interface FilterResult {
    result: string
    ready: boolean
    containsTags: boolean
}

export interface OptionFilterResult {
    result?: string
    ready?: boolean
    containsTags?: boolean
}

export type Filter<T,D> = (t: Filterable<D>, i: T) => FilterResult

export type WeakFilterResult = OptionFilterResult | string | void
export type WeakFilter<T,D> = (t: Filterable<D>, i: T) => WeakFilterResult

export interface Filterable<D> {
    getDefaultRepresentation(): string
    getRawRepresentation(): string
}

const wrapWithBool = (result: string, bool: boolean): FilterResult => ({
    result: result,
    ready: bool,
    containsTags: false,
})

const wrapWithReady = (result: string): FilterResult => wrapWithBool(result, true)
const wrapWithReadyBubbled = (result: string, ready: boolean): FilterResult => wrapWithBool(result, ready)

const nullFilterResult: FilterResult = {
    result: null,
    ready: false,
    containsTags: false,
}

const withStandardizedFilterResult = <T,D>(wf: WeakFilter<T,D>): Filter<T,D> => (t: Filterable<D>, i: T): FilterResult => {
    const input = wf(t, i)

    switch (typeof input) {
        case 'string':
            return wrapWithReady(input)

        // includes null
        case 'object':
            return {
                result: input.result ?? '',
                ready: input.ready ?? true,
                containsTags: input.containsTags ?? false,
            }

        // undefined
        default:
            // marks as not ready
            return nullFilterResult
    }
}

export interface Readiable {
    ready: boolean
}

const defaultFilter = <T extends Readiable, D extends object>(t: Filterable<D>, i: T) => wrapWithReadyBubbled(t.getDefaultRepresentation(), i.ready)
const baseFilter = <T extends Readiable, D extends object>(t: Filterable<D>, i: T) => wrapWithReadyBubbled(t.getRawRepresentation(), i.ready)
const rawFilter = <D extends object>(t: Filterable<D>) => wrapWithReady(t.getRawRepresentation())

const defaultOptions = {}

export class FilterApi<T extends Readiable, D extends object> {
    private filters: Map<string, Filter<T,D>> = new Map()
    private options: Map<string, Partial<D>> = new Map()

    constructor() {
        this.register('base', baseFilter)
        this.register('raw', rawFilter)
    }

    register(name: string, filter: WeakFilter<T,D>, options: Partial<D> = defaultOptions): void {
        this.filters.set(name, withStandardizedFilterResult(filter))
        this.options.set(name, options)
    }

    has(name: string): boolean {
        return name === 'raw' || name === 'base'
            ? true
            : this.filters.has(name)
    }

    get(name: string): Filter<T,D> | null {
        return this.filters.has(name)
            ? this.filters.get(name)
            : null
    }

    getOrDefault(name: string): Filter<T,D> {
        return this.get(name) ?? defaultFilter
    }

    getOptions(name: string): Partial<D> | null {
        return this.options.has(name)
            ? this.options.get(name)
            : null
    }

    getOrDefaultOptions(name: string): Partial<D> {
        return this.getOptions(name) ?? {}
    }

    unregisterFilter(name: string): void {
        this.filters.delete(name)
    }

    clearFilters(): void {
        this.filters.clear()
    }

    execute(name: string, data: Filterable<D>, internals: T): FilterResult {
        const filter = this.getOrDefault(name)
        const result = filter(data, internals)

        return result
    }
}
