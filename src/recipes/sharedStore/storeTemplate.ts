import type { TagNode, Internals } from "../../types";

import { Storage } from "../../filterManager/storage";

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
    operation: <T extends Record<string, unknown>>(
        tag: TagNode,
        internals: Internals<T>,
    ) => (store: Store) => string | void,
) => <T extends Record<string, unknown>>(
    tag: TagNode,
    internals: Internals<T>,
) => {
    const result = (internals.cache.over(
        storeId,
        operation(tag, internals),
        new Store(new Map<string, U>()),
    ) ?? "") as string;

    return { ready: true, result: result };
};
