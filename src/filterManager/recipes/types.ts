import type { FilterApi } from '../filters'
import type { Tag } from '../../tags'
import type { Internals } from '..'

export type { FilterApi, WeakFilter } from '../filters'
export type { Tag } from '../../tags'
export type { Internals } from '..'
export type { Deferred } from '../deferred'

export type Recipe = (options: object) => (filterApi: FilterApi) => void
export type EllipsisMaker = (t: Tag, i: Internals, isActive: boolean) => string
