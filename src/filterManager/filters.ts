import type { Internals } from '.'

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

export type Filter = (t: Filterable, i: Internals) => FilterResult

export type WeakFilterResult = OptionFilterResult | string | void
export type WeakFilter = (t: Filterable, i: Internals) => WeakFilterResult

export interface Filterable {
    getDefaultRepresentation(): string
    getRawRepresentation(): string
    getFilterKey(): string
    setOptions(options: DataOptions): void
}

export type DataOptions = object

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

const withStandardizedFilterResult = (wf: WeakFilter): Filter => (t: Filterable, i: Internals): FilterResult => {
    const input = wf(t, i)
    console.log(wf, input, t.getFilterKey())

    switch (typeof input) {
        case 'string':
            console.log('yo')
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

export type FilterWithSeparators = [Filter]

const baseFilter: Filter = (t: Filterable, i: Internals) => wrapWithReadyBubbled(t.getRawRepresentation(), i.ready)
const rawFilter: Filter = (t: Filterable) => wrapWithReady(t.getRawRepresentation())
const defaultFilter: Filter = (t: Filterable, i: Internals) => wrapWithReadyBubbled(t.getDefaultRepresentation(), i.ready)

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

    get(name: string): Filter | null {
        const result = this.getWithOptions(name)

        return result === null
            ? null
            : result[0]
    }

    getOptions(name: string): DataOptions | null {
        const result = this.getWithOptions(name)

        return result === null
            ? null
            : result[1]
    }

    getOrDefault(name: string): Filter {
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
