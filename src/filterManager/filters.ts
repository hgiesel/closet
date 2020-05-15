import type {
    Internals,
} from '.'

export interface FilterResult {
    result: string
    ready: boolean
}

export interface Filterable {
    getDefaultRepresentation(): string
    getRawRepresentation(): string
    getFilterKey(): string
}

const wrapWithReady = (result: string): FilterResult => ({
    result: result,
    ready: true,
})

const wrapWithReadyBubbled = (result: string, ready: boolean): FilterResult => ({
    result: result,
    ready: ready,
})

const standardizeFilterResult = (wf: WeakFilter): Filter => (t: Filterable, i: Internals): FilterResult => {
    const input = wf(t, i)

    switch (typeof input) {
        case 'string':
            return wrapWithReady(input)

        // includes null
        case 'object':
            return {
                result: input.result,
                ready: input.ready ?? true,
            }

        // undefined
        default:
            return {
                // this will mark as "not ready"
                result: null,
                ready: false,
            }
    }
}

export type WeakFilter = (t: Filterable, i: Internals) => FilterResult | string | void
export type Filter = (t: Filterable, i: Internals) => FilterResult

const baseFilter: Filter = (t: Filterable, i: Internals) => wrapWithReadyBubbled(t.getRawRepresentation(), i.ready)
const rawFilter: Filter = (t: Filterable) => wrapWithReady(t.getRawRepresentation())
const defaultFilter: Filter = (t: Filterable, i: Internals) => wrapWithReadyBubbled(t.getDefaultRepresentation(), i.ready)

export class FilterApi {
    private filters: Map<string, WeakFilter>

    constructor() {
        this.filters = new Map()
    }

    register(name: string, filter: WeakFilter): void {
        this.filters.set(name, filter)
    }

    has(name: string): boolean {
        return name === 'raw' || name === 'base'
            ? true
            : this.filters.has(name)
    }

    get(name: string): Filter | null {
        return name === 'base'
            ? baseFilter
            : name === 'raw'
            ? rawFilter
            : this.filters.has(name)
            ? standardizeFilterResult(this.filters.get(name))
            : null
    }

    getOrDefault(name: string): Filter {
        const maybeResult =  this.get(name)

        if (maybeResult) {
            return maybeResult
        }

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

