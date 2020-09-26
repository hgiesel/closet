import type { TagNode } from '../template/nodes'
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
export type { TagNode } from '../template/nodes'
export type { Separator, WeakSeparator } from '../template/separator'

export type Recipe<T extends Record<string, unknown>> = (options?: Record<string, unknown>) => (filters: Registrar<T>) => void
export type Eval<T extends Record<string, unknown>, U> = (t: TagNode, i: Internals<T>) => U
export type { Stylizer } from './stylizer'

export type Triple<T> = [T, T, T]

export interface WrapOptions {
    wrapId: string
    getTagnames: (o: Record<string, unknown>) => string[]
    setTagnames: (o: Record<string, unknown>, newNames: string[]) => void
}

export type InactiveBehavior<T extends Record<string, unknown>> = (
    contexter: WeakFilter<T>,
    ellipser: WeakFilter<T>,
) => WeakFilter<T>

export type InactiveAdapter<T extends Record<string, unknown>> = (behavior: InactiveBehavior<T>) => InactiveBehavior<T>

export interface RecipeOptions {
    [key: string]: any
}
