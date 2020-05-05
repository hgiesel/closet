import type {
    Tag,
} from '../../templateTypes'

import type {
    FilterResult,
    Memoizer,
} from './types'

export const defaultMemoizer = (): Memoizer => {
    const map: Map<string, FilterResult> = new Map()

    return {
        hasItem: (k: string) => map.has(k),
        getItem: (k: string) => map.get(k),
        setItem: (k: string, v: FilterResult) => map.set(k, v),
        removeItem: (k: string) => map.delete(k),
        clear: () => map.clear(),
        raw: () => map,
    }
}


export const generateMemoizerKey = ({key, idx, valuesRaw}: Tag): string => (
    `${key}:${idx}:${valuesRaw}`
)
