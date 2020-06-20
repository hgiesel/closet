import type { Internals } from '.'

export interface FilterResult {
    result: string
    ready: boolean
}

export interface Filterable {
    getDefaultRepresentation(): string
    getRawRepresentation(): string
    getFilterKey(): string
    setOptions(options: DataOptions): void
}

type DataOptions = object

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

export type FilterWithSeparators = [Filter]

const baseFilter: Filter = (t: Filterable, i: Internals) => wrapWithReadyBubbled(t.getRawRepresentation(), i.round.ready)
const rawFilter: Filter = (t: Filterable) => wrapWithReady(t.getRawRepresentation())
const defaultFilter: Filter = (t: Filterable, i: Internals) => wrapWithReadyBubbled(t.getDefaultRepresentation(), i.round.ready)

export class FilterApi {
    private filters: Map<string, [Filter, DataOptions]>

    constructor() {
        this.filters = new Map()
    }

    register(name: string, filter: WeakFilter, options: DataOptions = {}): void {
        this.filters.set(name, [withStandardizedFilterResult(filter), options])
    }

    has(name: string): boolean {
        return name === 'raw' || name === 'base'
            ? true
            : this.filters.has(name)
    }

    getWithOptions(name: string): [Filter, DataOptions] | null {
        return name === 'base'
            ? [baseFilter, {}]
            : name === 'raw'
            ? [rawFilter, {}]
            : this.filters.has(name)
            ? this.filters.get(name)
            : null
    }

    getOrDefaultWithOptions(name: string): [Filter, DataOptions] {
        return this.getWithOptions(name) ?? [defaultFilter, {}]
    }

    get(name: string) {
        return this.getWithOptions(name)[0]
    }

    getOrDefault(name: string) {
        return this.getOrDefaultWithOptions(name)[0]
    }

    unregisterFilter(name: string): void {
        this.filters.delete(name)
    }

    clearFilters(): void {
        this.filters.clear()
    }

    execute(data: Filterable, internals: Internals): FilterResult {
        const filterKey = data.getFilterKey()
        const [filter, dataOptions] = this.getOrDefaultWithOptions(filterKey)

        data.setOptions(dataOptions)
        return filter(data, internals)
    }
}
