import type { Tag, FilterApi, Internals } from './types'

import { Stylizer } from './stylizer'

import {
    shuffle,
    sortWithIndices,
    topUpSortingIndices,
} from './utils'

export const shufflingRecipe = ({
    tagname,
    stylizer = new Stylizer(),
}) => (filterApi: FilterApi) => {
    const shuffleFilter = (
        { fullKey, fullOccur, num, values }: Tag,
        { cache, memory, deferred, round }: Internals,
    ) => {
        const id = `${fullKey}:${fullOccur}`
        // identifies each set tag in waitingSet

        const waitingSetKey = `${fullKey}:waitingSet`
        // per fullKey
        // in cache: Set with all filters who wait for the inner sets to be ready

        const applyKey = `${id}:apply`
        // per fullKey + fullOccur
        // in cache: boolean whether ready for application
        // in deferred: sets apply key true, clear id of ready set from waitingSet

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

            return stylizer.stylize(popped)
        }

        if (!round.ready) {
            cache.over(waitingSetKey, (s: Set<string>) => s.add(id), new Set())
            return
        }

        if (!num) {
            return stylizer.stylize(shuffle(values[0]) as string[])
        }

        cache.fold(fullKey, (v: unknown[]) => v.concat(values[0]), [])

        // shuffle with num is round.ready for shuffling
        deferred.registerIfNotExists(applyKey, () => {
            cache.set(applyKey, true)
            cache.over(waitingSetKey, (set: Set<string>) => set.delete(id), new Set())
        })

        const shuffleKey = `${fullKey}:shuffle`
        deferred.registerIfNotExists(shuffleKey, () => {
            if (cache.get(waitingSetKey, new Set()).size > 0) {
                return
            }

            cache.fold(fullKey, <T>(vs: T[]) => {
                const sortingIndices = memory.fold(fullKey, (vs: number[]) => {
                    return topUpSortingIndices(vs, cache.get(fullKey, []).length)
                }, [])

                return sortWithIndices(vs, sortingIndices)
            }, [])
        })
    }

    filterApi.register(tagname, shuffleFilter as any)
}
