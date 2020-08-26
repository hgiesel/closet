import type { TagNode, Internals } from '../types'

import { Storage } from '../../filterManager/storage'

export const defaultSeparator = { sep: '::' }
export const defaultInnerSeparator = { sep: '||' }

export class SharedStore<T> extends Storage<T> {
    /**
     * Values in here are accessed with:
     * 1. the storeId, and
     * 2. a secondary storeKey
     *
     * Values can be updated
     * You would save values here that are shared among tags in here,
     * for configuring behavior of tags, see `PreferenceStore`
     */
}

export const storeTemplate = <Store extends SharedStore<U>, U>(
    Store: new (map: Map<string, U>) => Store,
) => (
    storeId: string,
    operation: (...vals: string[][]) => (store: Store) => void,
) => <T extends {}>(tag: TagNode, { cache }: Internals<T>) => {
    const commands = tag.values

    cache.over(storeId, operation(...commands), new Store(new Map<string, U>()))

    return { ready: true }
}
