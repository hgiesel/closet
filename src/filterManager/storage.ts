export interface StorageType {
    has(k: string): boolean
    get(k: string): unknown
    set(k: string, v: unknown): void
    delete(k: string): void
    clear(): void
}

export class Storage {
    private readonly storage: StorageType

    constructor(v: StorageType) {
        this.storage = v
    }

    set(name: string, value: unknown): void {
        this.storage.set(name, value)
    }

    has(name: string): boolean {
        return this.storage.has(name)
    }
    get(name: string, defaultValue: unknown = null): unknown {
        return this.has(name)
            ? this.storage.get(name)
            : defaultValue
    }

    fold(name: string, f: (v: unknown) => unknown, mempty: unknown): unknown {
        const result = f(this.get(name, mempty))
        this.set(name, result)

        return result
    }

    over(name: string, f: (v: unknown) => void, mempty: unknown): void {
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
