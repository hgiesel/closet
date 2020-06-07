import type { FilterApi } from '../filters'

export type { Tag } from '../../tags'
export type { FilterApi, WeakFilter } from '../filters'
export type { Internals } from '..'
export type { Deferred } from '../deferred'

export type Recipe = (tagname: string, options: object) => (filterApi: FilterApi) => void
