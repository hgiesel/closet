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
        const tagIdentifier = `${fullKey}:${fullOccur}`
        // identifies each set tag in waitingSet

        const applyKey = `${tagIdentifier}:apply`
        // per fullKey + fullOccur
        // in cache: boolean whether ready for application
        // in deferred: sets apply key true, deletes tagIdentifier from waitingSet

        const waitingSetKey = `${fullKey}:waitingSet`
        // in cache: Set with all tags (contains tagIdentifiers) who wait for their inner sets to be ready

        const shuffleKey = `${fullKey}:shuffle`
        // in cache: holds all string values for one fullKey; will be empty after it's done
        // in memory: hold sorting indices, which are used as basis for shuffling
        // in deferred: tries to shuffle cache[shuffleKey], stops if waitingSet is not empty

        /////////// APPLY LOGIC
        if (cache.get(applyKey, false)) {
            const waitingSet = cache.get(waitingSetKey, new Set()) as Set<string>
            if (waitingSet.size > 0) {
                // continue waiting for other tags with same fullKey
                return
            }

            const popped: string[] = []
            const possibleValues = cache.get(shuffleKey, []) as string[]

            for (let x = 0; x < values[0].length; x++) {
                // pop off start, so the result is the same as in program logic
                popped.push(possibleValues.shift())
            }

            return stylizer.stylize(popped)
        }

        /////////// ADD TO SHUFFLE KEY LOGIC
        if (!round.ready) {
            // add to waitingSet
            cache.over(waitingSetKey, (s: Set<string>) => s.add(tagIdentifier), new Set())
            return
        }

        if (!num) {
            // TODO does not use memory
            return stylizer.stylize(shuffle(values[0]) as string[])
        }

        cache.fold(shuffleKey, (v: unknown[]) => v.concat(values[0]), [])

        /////////// TRY TO SHUFFLE FROM DEFERRED LOGIC
        // shuffle with num is round.ready for shuffling
        deferred.registerIfNotExists(applyKey, () => {
            console.log('bye')
            cache.set(applyKey, true)
            cache.over(waitingSetKey, (set: Set<string>) => set.delete(tagIdentifier), new Set())
        }, {
            priority: 10,
        })

        deferred.registerIfNotExists(shuffleKey, () => {
            console.log('hi')
            if (cache.get(waitingSetKey, new Set()).size > 0) {
                return
            }
            // will only go go beyong this point for the last set that becomes ready
            // because shuffling only needs to be done once

            cache.fold(shuffleKey, <T>(vs: T[]) => {
                const sortingIndices = memory.fold(shuffleKey, (vs: number[]) => {
                    return topUpSortingIndices(vs, cache.get(shuffleKey, []).length)
                }, [])

                return sortWithIndices(vs, sortingIndices)
            }, [])
        })
    }

    filterApi.register(tagname, shuffleFilter as any)
}
