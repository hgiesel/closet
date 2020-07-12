export interface StorageType<D> {
    has(k: string): boolean
    get<T extends D>(k: string): T
    set<T extends D>(k: string, v: T): void
    delete(k: string): void
    clear(): void
}

export class Storage<D> {
    /**
     * @param D
     * is useful for restriciting values available by options storage
     * however is otherwise set to unknown (top type)
     */
    private readonly storage: StorageType<D>

    constructor(v: StorageType<D>) {
        this.storage = v
    }

    set<T extends D>(name: string, value: T): void {
        this.storage.set(name, value)
    }

    has(name: string): boolean {
        return this.storage.has(name)
    }

    get<T extends D>(name: string, defaultValue: T): T {
        return this.has(name)
            ? this.storage.get(name)
            : defaultValue
    }

    fold<T extends D>(name: string, f: (v: T) => T, mempty: T): T {
        const result = f(this.get(name, mempty))
        this.set(name, result)

        return result
    }

    over<T extends D>(name: string, f: (v: T) => void, mempty: T): void {
        if (!this.has(name)) {
            f(mempty)
            this.set(name, mempty)
        }

        else {
            f(this.get(name, mempty))
        }
    }

    delete(name: string): void {
        this.storage.delete(name)
    }

    clear(): void {
        this.storage.clear()
    }
}
