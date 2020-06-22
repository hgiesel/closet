import type { WeakFilterResult } from '../filterManager/filters'
import type { TagData } from '../template/tags'
import type { Internals, Filters } from '..'
import type { Stylizer } from './stylizer'

export type { Filters, AftermathInternals, DeferredInternals, Internals } from '..'
export type { WeakFilter, WeakFilterResult, DataOptions } from '..'
export type { DeferredApi, Deferred } from '../filterManager/deferred'

export type { TagData, Separator, WeakSeparator } from '../template/tags'

export type Recipe = (options: object) => (filters: Filters) => void
export type Ellipser = (t: TagData, i: Internals) => string
export type FilterPredicate = (t: TagData, i: Internals) => boolean

export interface WrapOptions {
    wrapId?: string
    getTagnames?: (o: object) => string[]
    setTagnames?: (o: object, newNames: string[]) => void
}

export type ActiveBehavior = (stylizer: Stylizer, ellipser: Ellipser) => (t: TagData, i: Internals) => WeakFilterResult
export type InactiveBehavior = (contexter: Ellipser, ellipser: Ellipser) => (t: TagData, i: Internals) => WeakFilterResult
