export interface FilterResult {
    result: string
    ready: boolean
    containsTags: boolean
}

export type Filter<T> = (t: Filterable, i: T) => FilterResult

export type WeakFilterResult = Partial<FilterResult> | string | void
export type WeakFilter<T> = (t: Filterable, i: T) => WeakFilterResult

export interface Filterable {
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

const withStandardizedFilterResult = <T>(wf: WeakFilter<T>): Filter<T> => (t: Filterable, i: T): FilterResult => {
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

const defaultFilter = <T extends Readiable>(t: Filterable, i: T) => wrapWithReadyBubbled(t.getDefaultRepresentation(), i.ready)
const baseFilter = <T extends Readiable>(t: Filterable, i: T) => wrapWithReadyBubbled(t.getRawRepresentation(), i.ready)
const rawFilter = (t: Filterable) => wrapWithReady(t.getRawRepresentation())

export class FilterApi<T extends Readiable> {
    private filters: Map<string, Filter<T>> = new Map()

    constructor() {
        this.register('base', baseFilter)
        this.register('raw', rawFilter)
    }

    register(name: string, filter: WeakFilter<T>): void {
        this.filters.set(name, withStandardizedFilterResult(filter))
    }

    has(name: string): boolean {
        return name === 'raw' || name === 'base'
            ? true
            : this.filters.has(name)
    }

    get(name: string): Filter<T> | null {
        return this.filters.has(name)
            ? this.filters.get(name)
            : null
    }

    getOrDefault(name: string): Filter<T> {
        return this.get(name) ?? defaultFilter
    }

    unregisterFilter(name: string): void {
        this.filters.delete(name)
    }

    clearFilters(): void {
        this.filters.clear()
    }

    execute(name: string, data: Filterable, internals: T): FilterResult {
        const filter = this.getOrDefault(name)
        const result = filter(data, internals)

        return result
    }
}
