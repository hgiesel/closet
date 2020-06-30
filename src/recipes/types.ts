import type { WeakFilterResult } from '../filterManager/filters'
import type { TagData } from '../template/tags'
import type { Internals, Registrar } from '..'
import type { Stylizer } from './stylizer'

export type { Registrar, Filters, AftermathInternals, DeferredInternals, Internals } from '..'
export type { DataOptions, WeakFilter, WeakFilterResult } from '..'
export type { DeferredApi, Deferred } from '../filterManager/deferred'

export type { TagData, Separator } from '../template/tags'

export type Recipe<T extends object> = (options?: object) => (filters: Registrar<T>) => void
export type Ellipser<T extends object> = (t: TagData, i: Internals<T>) => string
export type FilterPredicate<T extends object> = (t: TagData, i: Internals<T>) => boolean
export type { Stylizer } from './stylizer'

export interface WrapOptions {
    wrapId?: string
    getTagnames?: (o: object) => string[]
    setTagnames?: (o: object, newNames: string[]) => void
}

export type ActiveBehavior<T extends object, U extends object> = (stylizer: Stylizer, ellipser: Ellipser<T>) => (t: TagData, i: Internals<U>) => WeakFilterResult
export type InactiveBehavior<T extends object, U extends object> = (contexter: Ellipser<T>, ellipser: Ellipser<T>) => (t: TagData, i: Internals<U>) => WeakFilterResult
