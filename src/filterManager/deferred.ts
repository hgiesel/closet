import { PriorityQueue } from "./priorityQueue";

export type Deferred<T> = (entry: DeferredEntry<T>, internals: T) => void;

export interface DeferredEntry<T> {
    keyword: string;
    procedure: Deferred<T>;
    priority: number;
    persistent: boolean;
}

export interface DeferredOptions {
    priority: number;
    persistent: boolean;
}

const defaultDeferredOptions: DeferredOptions = {
    priority: 0,
    persistent: false,
};

// bigger number means higher priority, and higher priority means executed first
const deferredComparator = <T>(
    x: DeferredEntry<T>,
    y: DeferredEntry<T>,
): boolean => x.priority > y.priority;

export class DeferredApi<T> {
    private readonly _deferred: Map<string, DeferredEntry<T>>;
    private readonly _blocked: Set<string>;

    constructor() {
        this._deferred = new Map();
        this._blocked = new Set();
    }

    register(
        keyword: string,
        procedure: Deferred<T>,
        options: Partial<DeferredOptions> = defaultDeferredOptions,
    ): void {
        this._deferred.set(keyword, {
            keyword: keyword,
            procedure: procedure,
            priority: options.priority ?? defaultDeferredOptions.priority,
            persistent: options.persistent ?? defaultDeferredOptions.persistent,
        });
    }

    registerIfNotExists(
        keyword: string,
        procedure: Deferred<T>,
        options: Partial<DeferredOptions> = defaultDeferredOptions,
    ): void {
        if (!this.isRegistered(keyword)) {
            this.register(keyword, procedure, options);
        }
    }

    unregister(keyword: string): void {
        this._deferred.delete(keyword);
    }

    isRegistered(keyword: string): boolean {
        return this._deferred.has(keyword);
    }

    block(keyword: string) {
        this._blocked.add(keyword);
    }

    unblock(keyword: string) {
        this._blocked.delete(keyword);
    }

    isBlocked(keyword: string): boolean {
        return this._blocked.has(keyword);
    }

    clear(): void {
        this._deferred.clear();
        this._blocked.clear();
    }

    executeEach(internals: T): void {
        const prioQueue = new PriorityQueue<DeferredEntry<T>>(
            deferredComparator,
        );
        prioQueue.push(...this._deferred.values());

        for (const def of prioQueue.generate()) {
            if (!this.isBlocked(def.keyword)) {
                def.procedure(def, internals);
            }

            if (!def.persistent) {
                this.unregister(def.keyword);
            }
        }

        this._blocked.clear();
    }
}
