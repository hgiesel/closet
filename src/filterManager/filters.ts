import type {
    Internals,
} from '.'

import type {
    Tag,
} from '../tags'

import {
    TAG_START,
    TAG_END,
    ARG_SEP,
} from '../utils'

export interface FilterResult {
    result: string
    memoize?: boolean
}

const defaultFilter = ({fullKey, valuesRaw}: Tag): FilterResult => ({
    result: valuesRaw === null
        ? `${TAG_START}${fullKey}${TAG_END}`
        : `${TAG_START}${fullKey}${ARG_SEP}${valuesRaw}${TAG_END}`,
    memoize: false,
})

const rawFilter = ({valuesRaw}: Tag): FilterResult => ({
    result: valuesRaw,
    memoize: false,
})

export type Filter = (t: Tag, i: Internals) => FilterResult | string

export class FilterApi {
    private filters: Map<string, any>

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
}
