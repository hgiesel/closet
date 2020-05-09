import type {
    Tag,
} from '../tags'

import type {
    FilterResult,
} from './filters'

export const generateMemoizerKey = ({key, idx, valuesRaw}: Tag): string => (
    `${key}:${idx}:${valuesRaw}`
)

export interface Memoizer {
    hasItem(k: string): boolean
    getItem(k: string): FilterResult
    setItem(k: string, v: FilterResult): void
    removeItem(k: string): void
    clear(): void
    raw?(): unknown
}

const map: Map<string, FilterResult> = new Map()
export const defaultMemoizer:  Memoizer = {
    hasItem: (k: string) => map.has(k),
    getItem: (k: string) => map.get(k),
    setItem: (k: string, v: FilterResult) => map.set(k, v),
    removeItem: (k: string) => map.delete(k),
    clear: () => map.clear(),
}

