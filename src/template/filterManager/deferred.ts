import type {
    DeferredApi,
} from './types'

import type {
    Tag,
} from '../../templateTypes'

export const mkDeferredApi = (deferred: Map<string, () => void>): DeferredApi => {
    const registerDeferred = (name, filter) => {
        deferred.set(name, filter)
    }

    const hasDeferred = (name) => deferred.has(name)

    const unregisterDeferred = (name) => {
        deferred.delete(name)
    }

    const clearDeferred = () => {
        deferred.clear()
    }

    return {
        register: registerDeferred,
        has: hasDeferred,
        unregister: unregisterDeferred,
        clear: clearDeferred,
    }
}
