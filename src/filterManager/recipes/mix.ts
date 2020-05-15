import type {
    Tag
} from '../../tags'

import type {
    FilterApi
} from '../filters'

import Stylizer from './stylizer'

import type {
    Internals,
} from '..'

import {
    shuffle,
} from './utils'

const mixRecipe = (
    keyword: string,
    stylizer = new Stylizer(),
) => (filterApi: FilterApi) => {
    const mixFilter = (
        { fullKey, fullOccur, num, values }: Tag,
        { cache, deferred, ready }: Internals,
    ) => {
        const id = `${fullKey}:${fullOccur}`
        const waitingSetKey = `${fullKey}:waitingSet`
        const applyKey = `${id}:apply`

        if (cache.get(applyKey, false)) {
            const waitingSet = cache.get(waitingSetKey, new Set()) as Set<string>
            if (waitingSet.size > 0) {
                return
            }

            const popped: string[] = []
            const possibleValues = cache.get(fullKey, []) as string[]

            for (let x = 0; x < values[0].length; x++) {
                popped.push(possibleValues.shift() /* pop off start, so it looks comprehensible in simple cases */)
            }

            return stylizer.stylizeInner(popped)
        }

        if (!ready) {
            cache.over(waitingSetKey, (s: Set<string>) => s.add(id), new Set())
            return
        }

        if (!num) {
            return stylizer.stylizeInner(shuffle(values[0]) as string[])
        }

        cache.fold(fullKey, (v: unknown[]) => v.concat(values[0]), [])

        // mix with num is ready for shuffling
        deferred.registerIfNotExists(applyKey, () => {
            cache.set(applyKey, true)
            cache.over(waitingSetKey, (set: Set<string>) => set.delete(id), new Set())
        })

        const mixKey = `${fullKey}:mix`
        deferred.registerIfNotExists(mixKey, () => {
            const waitingSet = cache.get(waitingSetKey, new Set()) as Set<string>
            if (waitingSet.size > 0) {
                return
            }

            cache.fold(fullKey, shuffle, [])
        })
    }

    filterApi.register(keyword, mixFilter as any)
}

export default mixRecipe
