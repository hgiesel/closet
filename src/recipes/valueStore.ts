import type { TagNode, Internals } from './types'
import type { TagPredicate } from '../tagSelector'

import { parseTagSelector } from '../tagSelector'


export type StoreGetter<T> = { get: (key: string, num: number | null, fullOccur: number) => T }
export const constantGet = <T>(v: T): StoreGetter<T> => ({ get: () => v })

export const defaultSeparator = { sep: ';' }
export const innerSeparator = { sep: '=', trim: true, max: 2 }

export class ValueStore<T> {
    /**
     * Values can be stored in a value store
     * Tags can inquire against value stores with
     * 1. the storeId, and
     * 2. their (key, num, fullOccur)
     *
     * Values in a value store can not be updated, only overwritten
     * You would save settings regarding a specific tag in here,
     * not make a shared value, for that see `SharedStore` (TODO)
     */

    predicates: [TagPredicate, T][]
    defaultValue: T

    constructor(defaultValue: T) {
        this.defaultValue = defaultValue
        this.predicates = []
    }

    get(key: string, num: number, fullOccur: number): T {
        for (const [predicate, value] of this.predicates) {
            if (predicate(key, num, fullOccur)) {
                return value
            }
        }

        return this.defaultValue
    }

    set(selector: string, value: T): void {
        this.predicates.unshift([parseTagSelector(selector), value])
    }
}

export const valueStoreTemplate = <Store extends ValueStore<U>, U>(
    Store: new (u: U) => Store,
) => (
    storeId: string,
    defaultValue: U,
    operation: (...vals: string[]) => (a: Store) => void,
) => <T extends {}>(tag: TagNode, { cache }: Internals<T>) => {
    const commands = tag.values

    commands.forEach((cmd: string) => {
        cache.over(storeId, operation(...cmd), new Store(defaultValue))
    })

    return { ready: true }
}
