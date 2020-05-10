export class Store {
    private store: Map<string, unknown>

    constructor() {
        this.store = new Map()
    }

    set(name: string, value: unknown): void {
        this.store.set(name, value)
    }

    has(name: string): boolean {
        return this.store.has(name)
    }
    get(name: string, defaultValue: unknown = null): unknown {
        return this.has(name)
            ? this.store.get(name)
            : defaultValue
    }

    fold(name: string, f: (v: unknown) => unknown, mempty: unknown): void {
        this.set(name, f(this.get(name, mempty)))
    }

    delete(name: string): void {
        this.store.delete(name)
    }

    clear(): void {
        this.store.clear()
    }
}
