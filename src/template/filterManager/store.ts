import type {
    StoreApi,
} from './types'

export const mkStoreApi = (store: Map<string, unknown>): StoreApi => {
    const set = (name: string, value: unknown) => {
        store.set(name, value)
    }

    const has = (name: string) => store.has(name)
    const get = (name: string) => store.get(name)

    const over = (name: string, f: (v: any) => any) => {
        store.set(name, f(store.get(name)))
    }

    const deleteStore = (name: string) => {
        store.delete(name)
    }

    const clear = () => {
        store.clear()
    }

    return {
        set: set,
        get: get,
        has: has,
        over: over,

        delete: deleteStore,
        clear: clear,
    }
}
