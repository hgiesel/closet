export type Deferred = (name: string, ...rest: any[]) => void

interface DeferredEntry {
    procedure: Deferred
    priority: number
}

export class DeferredApi {
    private deferred: Map<string, DeferredEntry>

    constructor() {
        this.deferred = new Map()
    }

    register(name: string, proc: Deferred, prio=50): void {
        this.deferred.set(name, {
            procedure: proc,
            priority: prio,
        })
    }

    registerIfNotExists(name: string, proc: Deferred, prio=50): void {
        if (!this.has(name)) {
            this.register(name, proc, prio)
        }
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
        for (const [name, def] of this.deferred) {
            def.procedure(name, ...args)
        }
    }
}
