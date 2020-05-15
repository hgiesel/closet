export interface StorageType {
    has(k: string): boolean
    get<T>(k: string): T
    set<T>(k: string, v: T): void
    delete(k: string): void
    clear(): void
}

export class Storage {
    private readonly storage: StorageType

    constructor(v: StorageType) {
        this.storage = v
    }

    set<T>(name: string, value: T): void {
        this.storage.set(name, value)
    }

    has(name: string): boolean {
        return this.storage.has(name)
    }
    get<T>(name: string, defaultValue: T = null): T | null {
        return this.has(name)
            ? this.storage.get(name)
            : defaultValue
    }

    fold<T>(name: string, f: (v: T) => T, mempty: T): T {
        const result = f(this.get(name, mempty))
        this.set(name, result)

        return result
    }

    over<T>(name: string, f: (v: T) => void, mempty: T): void {
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
