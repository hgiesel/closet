import type { TagData, Registrar, Internals } from './types'

import {
    toNumbers,
    sortWithIndices,
} from './utils'

import {
    topUp,
} from './sortInStrategies'

export const orderingRecipe = ({
    tagname = 'ord',
    shuffleTagname = 'mix',
    separator = ',',
    sortInStrategy = topUp,
} = {}) => (registrar: Registrar<{}>) => {
    const ordFilter = (tag: TagData, { deferred, cache, memory }: Internals<{}>) => {
        /**
         * ordOccupiedKey in cache:
         * - shuffled nums which are already used
         * - cannot belong to multiple ords at once
         */

        const ordOccupiedKey = `${tag.key}:ord:occupied`

        const toBeOrdered = toNumbers(tag.values)
            .filter((v: number) => !cache.get<number[]>(ordOccupiedKey, []).includes(v))

        cache.fold(ordOccupiedKey, (v: number[]) => v.concat(toBeOrdered), [])

        const shuffleKeys = new Set(toBeOrdered.map((v: number) => `${shuffleTagname}${v}`))
        const ordKey = `${tag.key}:${tag.fullOccur}:ord`

        deferred.register(ordKey, () => {
            for (const sk of shuffleKeys) {
                deferred.block(`${sk}:shuffle`)

                const waitingSet = cache.get<Set<string>>(`${sk}:waitingSet`, new Set())
                const shuffleKey = `${sk}:shuffle`

                if (waitingSet.size !== 0) {
                    continue
                }

                const shuffleItems = cache.get<string[]>(shuffleKey, [])
                const toppedUpIndices = sortInStrategy(
                    cache.get<number[]>(ordKey, memory.get<number[]>(shuffleKey, [])),
                    shuffleItems.length,
                )

                // order mix items
                cache.fold(shuffleKey, (vs: string[]) => sortWithIndices(vs, toppedUpIndices), [])

                // remove mixKey from ord pool
                shuffleKeys.delete(shuffleKey)

                // possibly update with longer sort order
                cache.set(ordKey, toppedUpIndices)
                memory.set(shuffleKey, toppedUpIndices)
            }

            // need to remove ord deferred because it is persistent
            if (shuffleKeys.size === 0) {
                deferred.unregister(ordKey)
            }
        }, {
            priority: 35 /* must be higher than sequencers 15 */,
            persistent: true,
        })

        return { ready: true }
    }

    registrar.register(tagname, ordFilter, { separators: [separator] })
}
