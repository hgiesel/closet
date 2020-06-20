import type { Internals } from '.'

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

const withStandardizedFilterResult = (wf: WeakFilter): Filter => (t: Filterable, i: Internals): FilterResult => {
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

export type WeakFilterResult = FilterResult | string | void
export type WeakFilter = (t: Filterable, i: Internals) => WeakFilterResult
export type Filter = (t: Filterable, i: Internals) => FilterResult

const baseFilter: Filter = (t: Filterable, i: Internals) => wrapWithReadyBubbled(t.getRawRepresentation(), i.round.ready)
const rawFilter: Filter = (t: Filterable) => wrapWithReady(t.getRawRepresentation())
const defaultFilter: Filter = (t: Filterable, i: Internals) => wrapWithReadyBubbled(t.getDefaultRepresentation(), i.round.ready)

export class FilterApi {
    private filters: Map<string, Filter>

    constructor() {
        this.filters = new Map()
    }

    register(name: string, filter: WeakFilter): void {
        this.filters.set(name, withStandardizedFilterResult(filter))
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
            ? this.filters.get(name)
            : null
    }

    getOrDefault(name: string): Filter {
        return this.get(name) ?? defaultFilter
    }

    unregisterFilter(name: string): void {
        this.filters.delete(name)
    }

    clearFilters(): void {
        this.filters.clear()
    }

    execute(data: Filterable, internals: Internals): FilterResult {
        return withStandardizedFilterResult(this.getOrDefault(data.getFilterKey()))(data, internals)
    }
}

