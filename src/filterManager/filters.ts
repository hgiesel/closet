export interface FilterResult {
    ready: boolean
    result: string | null
    containsTags: boolean
}

export interface Filterable {
    getDefaultRepresentation(): string
    getRawRepresentation(): string
}

export type Filter<F, T> = (t: F, i: T) => FilterResult

export type WeakFilterResult = Partial<FilterResult> | string | void
export type WeakFilter<F, T> = (tag: F, internals: T) => WeakFilterResult

const wrapWithBool = (result: string, bool: boolean): FilterResult => ({
    ready: bool,
    result: result,
    containsTags: false,
})

const wrapWithReady = (result: string): FilterResult => wrapWithBool(result, true)
const wrapWithReadyBubbled = (result: string, ready: boolean): FilterResult => wrapWithBool(result, ready)

const nullFilterResult: FilterResult = {
    ready: false,
    result: null,
    containsTags: false,
}

const withStandardizedFilterResult = <F, T>(wf: WeakFilter<F, T>): Filter<F, T> => (tag: F, internals: T): FilterResult => {
    const input = wf(tag, internals)

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
const rawFilter = (t: Filterable) => wrapWithReady(t.getRawRepresentation())

export class FilterApi<F extends Filterable, T extends Readiable /* Internals with dependency on RoundInfo */> {
    private filters: Map<string, Filter<F, T>> = new Map()

    constructor() {
        this.register('raw', rawFilter)
    }

    register(name: string, filter: WeakFilter<F, T>): void {
        this.filters.set(name, withStandardizedFilterResult(filter))
    }

    has(name: string): boolean {
        return this.filters.has(name)
    }

    get(name: string): Filter<F, T> | null {
        return this.filters.get(name) ?? null
    }

    getOrDefault(name: string): Filter<F, T> {
        return this.get(name) ?? defaultFilter
    }

    unregisterFilter(name: string): void {
        this.filters.delete(name)
    }

    clearFilters(): void {
        this.filters.clear()
    }

    execute(name: string, data: F, internals: T): FilterResult {
        const filter = this.getOrDefault(name)
        const result = filter(data, internals)

        return result
    }
}
