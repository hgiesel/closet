import type {
    TagApi,
} from '../tags'

import type {
    FilterApi,
} from './filters'

import type {
    DeferredApi,
} from './deferred'

import type {
    Store,
} from './store'

export interface Internals {
    nextIteration: NextIterationApi
    store: Store
    filters: FilterApi
    deferred: DeferredApi
    custom: object
    tag: TagApi
}

export interface NextIterationApi {
    activate(v?: boolean): void
    isActivated(): boolean
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
