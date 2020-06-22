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

export type Filter<T> = (t: Filterable, i: T) => FilterResult

export type WeakFilterResult = OptionFilterResult | string | void
export type WeakFilter<T> = (t: Filterable, i: T) => WeakFilterResult

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

const withStandardizedFilterResult = <T>(wf: WeakFilter<T>): Filter<T> => (t: Filterable, i: T): FilterResult => {
    const input = wf(t, i)
    console.log(wf, input, t.getFilterKey())

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
    private filters: Map<string, [Filter<T>, DataOptions]>

    constructor() {
        this.filters = new Map()

        this.register('base', baseFilter, {})
        this.register('raw', rawFilter, {})
    }

    register(name: string, filter: WeakFilter<T>, options: DataOptions = {}): void {
        this.filters.set(name, [withStandardizedFilterResult(filter), options])
    }

    has(name: string): boolean {
        return name === 'raw' || name === 'base'
            ? true
            : this.filters.has(name)
    }

    getWithOptions(name: string): [Filter<T>, DataOptions] | null {
        return this.filters.has(name)
            ? this.filters.get(name)
            : null
    }

    getOrDefaultWithOptions(name: string): [Filter<T>, DataOptions] {
        return this.getWithOptions(name) ?? [defaultFilter, {}]
    }

    get(name: string): Filter<T> | null {
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

    getOrDefault(name: string): Filter<T> {
        return this.getOrDefaultWithOptions(name)[0]
    }

    unregisterFilter(name: string): void {
        this.filters.delete(name)
    }

    clearFilters(): void {
        this.filters.clear()
    }

    execute(data: Filterable, internals: T): FilterResult {
        const filterKey = data.getFilterKey()
        const [filter, dataOptions] = this.getOrDefaultWithOptions(filterKey)

        data.setOptions(dataOptions)
        return filter(data, internals)
    }
}
