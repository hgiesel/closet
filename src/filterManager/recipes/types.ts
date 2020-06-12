import type { FilterApi, WeakFilterResult } from '../filters'
import type { Tag } from '../../tags'
import type { Internals } from '..'
import type { Stylizer } from './stylizer'

export type { FilterApi, WeakFilter, WeakFilterResult } from '../filters'
export type { Tag } from '../../tags'
export type { Internals } from '..'
export type { Deferred } from '../deferred'

export type Recipe = (options: object) => (filterApi: FilterApi) => void
export type Ellipser = (t: Tag, i: Internals) => string
export type FilterPredicate = (t: Tag, i: Internals) => boolean

export interface WrapOptions {
    wrapId?: string
    getTagnames?: (o: object) => string[]
    setTagnames?: (o: object, newNames: string[]) => void
}

export type ActiveBehavior = (stylizer: Stylizer, ellipser: Ellipser) => (t: Tag, i: Internals) => WeakFilterResult
export type InactiveBehavior = (contexter: Ellipser, ellipser: Ellipser) => (t: Tag, i: Internals) => WeakFilterResult
