import type {
    DeferredApi,
} from './types'

import type {
    Tag,
} from '../types'

export const mkDeferredApi = (deferred: Map<string, (...any) => void>): DeferredApi => {
    const registerDeferred = (name: string, proc: (...any) => void): void => {
        deferred.set(name, proc)
    }

    const hasDeferred = (name: string): boolean => deferred.has(name)

    const unregisterDeferred = (name: string): void => {
        deferred.delete(name)
    }

    const clearDeferred = (): void => {
        deferred.clear()
    }

    const forEachDeferred = (...args: any[]): void => {
        for (const [name, func] of deferred) {
            func(name, ...args)
        }
    }

    return {
        register: registerDeferred,
        has: hasDeferred,
        unregister: unregisterDeferred,
        clear: clearDeferred,
        forEach: forEachDeferred,
    }
}
