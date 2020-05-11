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
    private readonly _blocked: Set<string>

    constructor() {
        this._deferred = new Map()
        this._blocked = new Set()
    }

    register(keyword: string, procedure: Deferred, priority=50): void {
        this._deferred.set(keyword, {
            keyword: keyword,
            procedure: procedure,
            priority: priority,
        })
    }

    registerIfNotExists(keyword: string, proc: Deferred, prio=50): void {
        if (!this.isRegistered(keyword)) {
            this.register(keyword, proc, prio)
        }
    }

    unregister(keyword: string): void {
        this._deferred.delete(keyword)
    }

    isRegistered(keyword: string): boolean {
        return this._deferred.has(keyword)
    }

    block(keyword: string) {
        this._blocked.add(keyword)
    }

    unblock(keyword: string) {
        this._blocked.delete(keyword)
    }

    isBlocked(keyword: string): boolean {
        return this._blocked.has(keyword)
    }

    clear(): void {
        this._deferred.clear()
        this._blocked.clear()
    }

    executeEach(...args: any[]): void {
        const prioQueue = new PriorityQueue<DeferredEntry>(deferredComparator)
        prioQueue.push(...this._deferred.values())

        for (const def of prioQueue.generate()) {
            if (!this.isBlocked(def.keyword)) {
                def.procedure(def.keyword, ...args)
            }
        }
    }
}
