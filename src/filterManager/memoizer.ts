import type {
    Tag,
} from '../tags'

import type {
    FilterResult,
    Memoizer,
} from './types'

const map: Map<string, FilterResult> = new Map()

export const defaultMemoizer:  Memoizer = {
    hasItem: (k: string) => map.has(k),
    getItem: (k: string) => map.get(k),
    setItem: (k: string, v: FilterResult) => map.set(k, v),
    removeItem: (k: string) => map.delete(k),
    clear: () => map.clear(),
}

export const generateMemoizerKey = ({key, idx, valuesRaw}: Tag): string => (
    `${key}:${idx}:${valuesRaw}`
)
