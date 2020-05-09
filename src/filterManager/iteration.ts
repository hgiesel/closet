import type {
    Internals,
} from '.'

import type {
    Tag,
} from '../tags'

import {
    FilterResult,
    Filter,
} from './filters'

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
