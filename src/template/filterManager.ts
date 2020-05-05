import type {
    Tag,
} from '../templateTypes'

const defaultFilter = ({fullKey, valuesRaw}: Tag): string => (
    `[[${fullKey}::${valuesRaw}]]`
)

interface Internals {
    has(k: string): boolean
    get(k: string): any
    set(k: string, v: any): void
    over(k: string, f: (v: any) => any): void
    iterateAgain(b: boolean): void
    nextIteration(): boolean
}

interface FilterResult {
    result: string
    memoize: boolean
}

const mkStandardFilterResult = (result): FilterResult => ({
    result: result,
    memoize: false,
})

const mkFilterManager = () => {
    const filters: Map<string, (Tag, Internals) => FilterResult | string> = new Map()

    const store = new Map()
    let nextIteration: boolean = false

    const mkInternalsInterface = (): Internals => {
        const has = (key) => store.has(key)
        const get = (key) => store.get(key)
        const set = (key, item) => store.set(key, item)
        const over = (key, f) => store.set(key, f(store.get(key)))

        const iterateAgain = (value: boolean = true) => {
            nextIteration = Boolean(value)
        }

        return {
            over: over,
            get: get,
            set: set,
            has: has,

            iterateAgain: iterateAgain,
            nextIteration: () => nextIteration,
        }
    }

    const internals = mkInternalsInterface()

    const registerFilter = (name, filter) => {
        filters.set(name, filter)
    }

    const executeFilter = (key, data): FilterResult => {
        const result = filters.has(key)
            ? filters.get(key)(data, internals)
            : defaultFilter(data)

        return typeof result === 'string'
            ? mkStandardFilterResult(result)
            : result

    }

    const next = () => {
    }

    return {
        registerFilter: registerFilter,
        executeFilter: executeFilter,
        store: store,
        nextIteration: () => nextIteration,
    }
}

export default mkFilterManager
