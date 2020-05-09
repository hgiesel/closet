import type {
    Filter,
    FilterApi,
    FilterResult,
    Internals,
} from './types'

import type {
    Tag,
} from '../tags'

import {
    TAG_START,
    TAG_END,
    ARG_SEP,
} from '../utils'

const defaultFilter = ({fullKey, valuesRaw}: Tag): FilterResult => (console.log('meh', valuesRaw), {
    result: valuesRaw === null
        ? `${TAG_START}${fullKey}${TAG_END}`
        : `${TAG_START}${fullKey}${ARG_SEP}${valuesRaw}${TAG_END}`,
    memoize: false,
})

const rawFilter = ({valuesRaw}: Tag): FilterResult => ({
    result: valuesRaw,
    memoize: false,
})

const standardizeFilterResult = (input: string | FilterResult): FilterResult => {
    switch (typeof input) {
        case 'string':
            return {
                result: input,
                memoize: false,
            }

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

export const executeFilter = (filter: Filter, data: Tag, internals: Internals): FilterResult =>
    standardizeFilterResult(filter(data, internals))

export const mkFilterApi = (filters: Map<string, Filter>): FilterApi => {
    const registerFilter = (name, filter) => {
        filters.set(name, filter)
    }

    const hasFilter = (name: string) => name === 'raw'
        ? true
        : filters.has(name)

    const getFilter = (name: string) => name === 'raw'
        ? rawFilter
        : filters.has(name)
        ? filters.get(name) 
        : null

    const getOrDefaultFilter = (name: string) => getFilter(name) ?? defaultFilter

    const unregisterFilter = (name: string) => {
        filters.delete(name)
    }

    const clearFilters = () => {
        filters.clear()
    }

    return {
        get: getFilter,
        getOrDefault: getOrDefaultFilter,

        register: registerFilter,
        has: hasFilter,
        unregister: unregisterFilter,
        clear: clearFilters,
    }
}
