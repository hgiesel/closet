import type {
    Internals,
} from '.'

export interface FilterResult {
    result: string
    memoize?: boolean
}

export interface Filterable {
    getDefaultRepresentation(): string
    getRawRepresentation(): string
    getFilterKey(): string
}

const wrapWithNonMemoize = (result: string): FilterResult => ({
    result: result,
    memoize: false,
})

const standardizeFilterResult = (wf: WeakFilter): Filter => (t: Filterable, i: Internals): FilterResult => {
    const input = wf(t, i)

    switch (typeof input) {
        case 'string':
            return wrapWithNonMemoize(input)

        // includes null
        case 'object':
            return {
                result: input.result ?? '',
                memoize: input.memoize ?? false,
            }

        // undefined
        default:
            return {
                // this will mark as "not ready"
                result: null,
                memoize: false,
            }
    }
}

export type WeakFilter = (t: Filterable, i: Internals) => FilterResult | string
export type Filter = (t: Filterable, i: Internals) => FilterResult

export class FilterApi {
    private filters: Map<string, WeakFilter>

    constructor() {
        this.filters = new Map()
    }

    register(name: string, filter: Filter): void {
        this.filters.set(name, filter)
    }

    has(name: string): boolean {
        return name === 'raw'
            ? true
            : this.filters.has(name)
    }

    get(name: string): Filter | null {
        return name === 'raw'
            ? (t) => wrapWithNonMemoize(t.getRawRepresentation())
            : this.filters.has(name)
            ? standardizeFilterResult(this.filters.get(name))
            : null
    }

    getOrDefault(name: string): Filter {
        const maybeResult =  this.get(name)

        if (maybeResult) {
            return standardizeFilterResult(maybeResult)
        }

        const defaultFilter = (t: Filterable) => wrapWithNonMemoize(t.getDefaultRepresentation())
        return defaultFilter
    }

    unregisterFilter(name: string): void {
        this.filters.delete(name)
    }

    clearFilters(): void {
        this.filters.clear()
    }

    execute(data: Filterable, internals: Internals): FilterResult {
        return standardizeFilterResult(this.getOrDefault(data.getFilterKey()))(data, internals)
    }
}

