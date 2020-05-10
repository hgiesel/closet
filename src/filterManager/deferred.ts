export type Deferred = (name: string, ...rest: any[]) => void

export class DeferredApi {
    private deferred: Map<string, Deferred>

    constructor() {
        this.deferred = new Map()
    }

    register(name: string, proc: Deferred): void {
        this.deferred.set(name, proc)
    }

    has(name: string): boolean {
        return this.deferred.has(name)
    }

    unregister(name: string): void {
        this.deferred.delete(name)
    }

    clear(): void {
        this.deferred.clear()
    }

    executeEach(...args: any[]): void {
        for (const [name, func] of this.deferred) {
            func(name, ...args)
        }
    }
}
