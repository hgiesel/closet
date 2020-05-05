import type {
    FilterApi,
    FilterResult,
    Internals,
} from './types'

import type {
    Tag,
} from '../../templateTypes'

const defaultFilter = ({fullKey, valuesRaw}: Tag): string => (
    `[[${fullKey}::${valuesRaw}]]`
)

const standardizeFilterResult = (input: string | FilterResult): FilterResult => {
    if (typeof input === 'string') {
        return {
            result: input,
            memoize: false,
        }
    }

    return {
        result: input.result,
        memoize: input.memoize ?? false,
    }
}

export const executeFilter = (filters, name, data: Tag, internals: Internals): FilterResult => {
    const func = filters.has(name)
        ? filters.get(name)
        : defaultFilter

    const result = standardizeFilterResult(func(data, internals))
    return result
}

export const mkFilterApi = (filters: Map<string, (Tag, Internals) => FilterResult | string>): FilterApi => {
    const registerFilter = (name, filter) => {
        filters.set(name, filter)
    }

    const hasFilter = (name) => filters.has(name)

    const unregisterFilter = (name) => {
        filters.delete(name)
    }

    const clearFilters = () => {
        filters.clear()
    }

    return {
        register: registerFilter,
        has: hasFilter,
        unregister: unregisterFilter,
        clear: clearFilters,
    }
}
