import type {
    Comparator,
} from './priorityQueue'

import {
    PriorityQueue,
} from './priorityQueue'

export type Deferred = (keyword: string, ...rest: any[]) => void

interface DeferredEntry {
    keyword: string,
    procedure: Deferred
    priority: number
}

const deferredComparator: Comparator = (x: DeferredEntry, y: DeferredEntry) => x.priority < y.priority

export class DeferredApi {
    private readonly _deferred: Map<string, DeferredEntry>

    constructor() {
        this._deferred = new Map()
    }

    register(keyword: string, procedure: Deferred, priority=50): void {
        this._deferred.set(keyword, {
            keyword: keyword,
            procedure: procedure,
            priority: priority,
        })
    }

    registerIfNotExists(keyword: string, proc: Deferred, prio=50): void {
        if (!this.has(keyword)) {
            this.register(keyword, proc, prio)
        }
    }

    has(keyword: string): boolean {
        return this._deferred.has(keyword)
    }

    unregister(keyword: string): void {
        this._deferred.delete(keyword)
    }

    clear(): void {
        this._deferred.clear()
    }

    executeEach(...args: any[]): void {
        const prioQueue = new PriorityQueue(deferredComparator)

        prioQueue.push(...this._deferred.values())
        prioQueue.forEach(({ procedure, keyword }) => procedure(keyword, ...args))
    }
}
