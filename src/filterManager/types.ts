import type {
    Tag,
    TagApi,
} from '../tags'

import type {
    FilterApi,
} from './filters'

import type Store from './store'

export interface Internals {
    nextIteration: NextIterationApi
    store: Store
    filters: FilterApi
    deferred: DeferredApi
    custom: object
    tag: TagApi
}

export type Filter = (t: Tag, i: Internals) => FilterResult | string

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


export interface DeferredApi {
    register(name: string, f: () => void): void
    unregister(name: string): void
    has(name: string): boolean
    clear(): void
    forEach(...args: any[]): void
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