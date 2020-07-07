import type { TagData } from '../template/tags'
import type { Internals, Registrar, WeakFilter } from '..'
import type { Stylizer } from './stylizer'

export type { Registrar, Filters, AftermathInternals, DeferredInternals, Internals } from '..'
export type { DataOptions, WeakFilter, WeakFilterResult } from '..'
export type { DeferredApi, Deferred } from '../filterManager/deferred'

export type { TagData, Separator, WeakSeparator } from '../template/tags'

export type Recipe<T extends object> = (options?: object) => (filters: Registrar<T>) => void
export type Ellipser<T extends object, U> = (t: TagData, i: Internals<T>) => U
export type { Stylizer } from './stylizer'

export interface WrapOptions {
    wrapId?: string
    getTagnames?: (o: object) => string[]
    setTagnames?: (o: object, newNames: string[]) => void
}

export type ActiveBehavior<T extends object, U extends object> = (
    stylizer: Stylizer,
    ellipser: Ellipser<T, string[]>,
) => WeakFilter<U>

export type InactiveBehavior<T extends object, U extends object> = (
    stylizer: Stylizer,
    contexter: Ellipser<T, string[]>,
    ellipser: Ellipser<T, string[]>,
) => WeakFilter<U>

export type InactiveAdapter<T extends object, U extends object> = (behavior: InactiveBehavior<T,U>) => InactiveBehavior<T,U>
