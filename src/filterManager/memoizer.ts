import type {
    FilterResult,
} from './filters'

export interface MemoizerKeyable {
    makeMemoizerKey(): string
}

export interface Memoizer {
    hasItem(k: MemoizerKeyable): boolean
    getItem(k: MemoizerKeyable): FilterResult
    setItem(k: MemoizerKeyable, v: FilterResult): void
    removeItem(k: MemoizerKeyable): void
    clear(): void
    raw?(): unknown
}

const map: Map<string, FilterResult> = new Map()
export const defaultMemoizer:  Memoizer = {
    hasItem: (k: MemoizerKeyable) => map.has(k.makeMemoizerKey()),
    getItem: (k: MemoizerKeyable) => map.get(k.makeMemoizerKey()),
    setItem: (k: MemoizerKeyable, v: FilterResult) => map.set(k.makeMemoizerKey(), v),
    removeItem: (k: MemoizerKeyable) => map.delete(k.makeMemoizerKey()),
    clear: () => map.clear(),
}
