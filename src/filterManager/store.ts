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
    get(name: string, defaultValue: unknown): unknown {
        return this.store.get(name) ?? defaultValue
    }

    over(name: string, f: (v: unknown) => unknown): void {
        this.store.set(name, f(this.store.get(name)))
    }

    delete(name: string): void {
        this.store.delete(name)
    }

    clear(): void {
        this.store.clear()
    }
}
