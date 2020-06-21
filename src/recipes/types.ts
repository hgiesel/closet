import type { FilterApi, WeakFilterResult } from '../filterManager/filters'
import type { TagData } from '../template/tags'
import type { Internals } from '../filterManager'
import type { Stylizer } from './stylizer'

export type { AftermathInternals, DeferredInternals, Internals } from '../filterManager'
export type { FilterApi, WeakFilter, WeakFilterResult, DataOptions } from '../filterManager/filters'
export type { DeferredApi, Deferred } from '../filterManager/deferred'

export type { TagData, Separator, WeakSeparator } from '../template/tags'

export type Recipe = (options: object) => (filterApi: FilterApi) => void
export type Ellipser = (t: TagData, i: Internals) => string
export type FilterPredicate = (t: TagData, i: Internals) => boolean

export interface WrapOptions {
    wrapId?: string
    getTagnames?: (o: object) => string[]
    setTagnames?: (o: object, newNames: string[]) => void
}

export type ActiveBehavior = (stylizer: Stylizer, ellipser: Ellipser) => (t: TagData, i: Internals) => WeakFilterResult
export type InactiveBehavior = (contexter: Ellipser, ellipser: Ellipser) => (t: TagData, i: Internals) => WeakFilterResult
