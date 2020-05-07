import type {
    Tag,
} from '../../templateTypes'

export interface Internals {
    nextIteration: NextIterationApi
    store: StoreApi
    filters: FilterApi
    deferred: DeferredApi
    custom: object
}

export interface FilterResult {
    result: string
    memoize?: boolean
}

export interface Iteration {
    executeFilter: (key: string, data: Tag) => FilterResult
}

export interface Memoizer {
    hasItem(k: string): boolean
    getItem(k: string): FilterResult
    setItem(k: string, v: FilterResult): void
    removeItem(k: string): void
    clear(): void
    raw?(): unknown
}

export interface NextIterationApi {
    activate(v?: boolean): void
    isActivated(): boolean
}

export interface StoreApi {
    has(k: string): boolean
    get(k: string): any
    set(k: string, v: any): void
    over(k: string, f: (v: any) => any): void

    delete(k: string): void
    clear(): void
}

export interface FilterApi {
    register(name: string, filter: (t: Tag, i: Internals) => string | FilterResult): void
    unregister(name: string): void
    has(name: string): boolean
    clear(): void
}

export interface DeferredApi {
    register(name: string, f: () => void): void
    unregister(name: string): void
    has(name: string): boolean
    clear(): void
}

export interface TagApi {
    getTag(path: number[]): Tag,
    isFinal(path: number[]): boolean,
    areAllFinal(): boolean,
    exists(path: number[]): boolean,
}

export interface AnkiApi {
    card: string
    tagsRaw: string
    tags: string[]
}

export interface FilterManager {
    filters: FilterApi,
    addRecipe: any,
    iterations: any,
}
