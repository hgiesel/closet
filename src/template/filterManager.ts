import type {
    Tag,
} from '../templateTypes'

const defaultFilter = ({fullKey, valuesRaw}: Tag): string => (
    `[[${fullKey}::${valuesRaw}]]`
)


const mkFilterManager = () => {
    const filters = new Map()

    const store = new Map()
    let nextIteration: boolean = false

    const mkInternalsInterface = () => {
        const has = (key) => store.has(key)
        const get = (key) => store.get(key)
        const set = (key, item) => store.set(key, item)
        const over = (key, f) => store.set(key, f(store.get(key)))

        const iterateAgain = (value: boolean = true) => {
            nextIteration = Boolean(value)
        }

        const willDoNextIteration = () => nextIteration

        return {
            over: over,
            get: get,
            set: set,
            has: has,
        }
    }

    const internals = mkInternalsInterface()

    const registerFilter = (name, filter) => {
        filters.set(name, filter)
    }

    const executeFilter = (key, data) => {
        const result = filters.has(key)
            ? filters.get(key)(data, internals)
            : defaultFilter(data)

        return result
    }

    const next = () => {
    }

    return {
        registerFilter: registerFilter,
        executeFilter: executeFilter,
        internals: internals,
    }
}

export default mkFilterManager
