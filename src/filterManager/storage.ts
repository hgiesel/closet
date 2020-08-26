export interface StorageType<D> {
    has(storageTypeHasKey: string): boolean
    get(storageTypeKey: string): D | undefined
    set(storageTypeKey: string, storageTypeValue: D): void
    delete(storageTypeDeleteKey: string): void
    clear(): void
}

export class Storage<D> {
    /**
     * @param D
     * is useful for restriciting values available by options storage
     * however is otherwise set to unknown (top type)
     */
    protected readonly storage: StorageType<D>

    constructor(v: StorageType<D>) {
        this.storage = v
    }

    set<T extends D>(name: string, value: T): void {
        this.storage.set(name, value)
    }

    get<T extends D>(name: string, defaultValue: T): T {
        return this.storage.get(name) as T ?? defaultValue
    }

    has(name: string): boolean {
        return this.storage.has(name)
    }

    fold<T extends D>(name: string, foldFunc: (foldParam: T) => T, mempty: T): T {
        const result = foldFunc(this.get(name, mempty))
        this.set(name, result)

        return result
    }

    post<T extends D>(name: string, postFunc: (postParam: T) => T, mempty: T): T {
        const result = this.get(name, mempty)
        this.set(name, postFunc(result))

        return result
    }

    lazy<T extends D>(name: string, lazyFunc: () => T): T {
        // @ts-ignore
        return this.get(name, null) || this.fold(name, lazyFunc, null)
    }

    over<T extends D>(name: string, overFunc: (overParam: T) => void, mempty: T): void {
        const value = this.get(name, mempty)
        this.set(name, value)

        overFunc(value)
    }

    delete(name: string): void {
        this.storage.delete(name)
    }

    clear(): void {
        this.storage.clear()
    }
}
