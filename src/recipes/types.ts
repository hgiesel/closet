import type { TagData } from '../template/tags'
import type { Internals, Registrar, WeakFilter } from '..'

export type {
    Registrar, Filters,
    WeakFilter, WeakFilterResult,
    Internals, DeferredInternals, AftermathInternals,
    DeferredEntry, AftermathEntry,
    DataOptions,
} from '..'

export type { DeferredApi, Deferred } from '../filterManager/deferred'
export type { TagData, Separator, WeakSeparator } from '../template/tags'

export type Recipe<T extends object> = (options?: object) => (filters: Registrar<T>) => void
export type Eval<T extends object, U> = (t: TagData, i: Internals<T>) => U
export type { Stylizer } from './stylizer'

export interface WrapOptions {
    wrapId: string
    getTagnames: (o: object) => string[]
    setTagnames: (o: object, newNames: string[]) => void
}

export type InactiveBehavior<T extends object, U extends object> = (
    contexter: WeakFilter<T>,
    ellipser: WeakFilter<T>,
) => WeakFilter<U>

export type InactiveAdapter<T extends object, U extends object> = (behavior: InactiveBehavior<T,U>) => InactiveBehavior<T,U>

export interface RecipeOptions {
    [key: string]: any
}
