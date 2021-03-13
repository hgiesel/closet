import type { TagNode, Internals } from "../../types";

import { TagSelector } from "../../template/";

import { separated } from "../../template/optics";

export const defaultSeparated = separated({ sep: ";" });
export const innerSeparated = separated({ sep: "=", trim: true, max: 2 });

export class PreferenceStore<T> {
    /**
     * Values can be stored in a preference store
     * Tags can inquire against value stores if they provide
     * 1. the storeId, and
     * 2. their identification, typically (key, num, fullOccur)
     *
     * Values cannot be updated, only overwritten
     * You would save settings regarding a specific tag in here,
     * not make a shared value, for that see `SharedStore` (TODO)
     */

    selectors: [TagSelector, T][];
    defaultValue: T;

    constructor(defaultValue: T) {
        this.defaultValue = defaultValue;
        this.selectors = [];
    }

    protected set(selector: string, value: T): void {
        this.selectors.unshift([TagSelector.make(selector), value]);
    }

    get(key: string, num: number, fullOccur: number): T {
        const found = this.selectors.find(([selector]) =>
            selector.check(key, num, fullOccur),
        );

        return found ? found[1] : this.defaultValue;
    }
}

export const storeTemplate = <Store extends PreferenceStore<U>, U>(
    Store: new (u: U) => Store,
) => (
    storeId: string,
    defaultValue: U,
    operation: (...vals: string[]) => (a: Store) => void,
) => <T extends Record<string, unknown>>(
    tag: TagNode,
    { cache }: Internals<T>,
) => {
    const commands = tag.values;

    commands.forEach((cmd: string) => {
        cache.over(storeId, operation(...cmd), new Store(defaultValue));
    });

    return { ready: true };
};
