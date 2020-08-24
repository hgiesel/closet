import type { TagNode } from '../template/tags'
import type { Internals, Registrar, WeakFilter } from '..'

export type {
    Registrar,
    Filters,

    Filter,
    WeakFilter,
    WeakFilterResult,

    Internals,
    DeferredInternals,
    AftermathInternals,
    DeferredEntry,
    AftermathEntry,
    DataOptions,
} from '..'

export type { DeferredApi, Deferred } from '../filterManager/deferred'
export type { TagNode } from '../template/tags'
export type { Separator, WeakSeparator } from '../template/separator'

export type Recipe<T extends {}> = (options?: {}) => (filters: Registrar<T>) => void
export type Eval<T extends {}, U> = (t: TagNode, i: Internals<T>) => U
export type { Stylizer } from './stylizer'

export interface WrapOptions {
    wrapId: string
    getTagnames: (o: {}) => string[]
    setTagnames: (o: {}, newNames: string[]) => void
}

export type InactiveBehavior<T extends {}> = (
    contexter: WeakFilter<T>,
    ellipser: WeakFilter<T>,
) => WeakFilter<T>

export type InactiveAdapter<T extends {}> = (behavior: InactiveBehavior<T>) => InactiveBehavior<T>

export interface RecipeOptions {
    [key: string]: any
}
