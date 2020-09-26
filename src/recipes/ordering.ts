import type { TagNode, Registrar, Internals } from './types'

import { sortWithIndices } from './utils'
import { topUp } from './sortInStrategies'


export const orderingRecipe = ({
    tagname = 'ord',

    separator = ',',
    cmdSeparator = '::',

    sortInStrategy = topUp,
} = {}) => <T extends Record<string, unknown>>(registrar: Registrar<T>) => {
    const ordFilter = (tag: TagNode, { deferred, cache, memory }: Internals<T>) => {
        /**
         * @param tag.values must contain lists of *sequence ids* (!), not tagnames
         *
         * ordOccupiedKey in cache:
         * - shuffled nums which are already used
         * - cannot belong to multiple ords at once
         */

        for (const [idx, cmd] of tag.values.entries()) {
            const ordOccupiedKey = `${tag.key}:ord:occupied:${idx}`

            const toBeOrdered = cmd
                .filter((v: string) => !cache.get<string[]>(ordOccupiedKey, []).includes(v))

            cache.fold(ordOccupiedKey, (v: string[]) => v.concat(toBeOrdered), [])

            const orderSet = new Set<string>(toBeOrdered)
            const ordKey = `${tag.key}:${tag.fullOccur}:ord:${idx}`

            deferred.register(ordKey, () => {
                const orderKeys = Array.from(orderSet)
                const shuffleKeys = orderKeys.map((ok: string) => `${ok}:shuffle`)

                for (const [idx, ok] of orderKeys.entries()) {
                    const shuffleKey = shuffleKeys[idx]
                    const waitingSetKey = `${ok}:waitingSet`

                    deferred.block(shuffleKey)

                    const waitingSet = cache.get<Set<string>>(waitingSetKey, new Set())

                    if (waitingSet.size !== 0) {
                        continue
                    }

                    const presetShuffle = shuffleKeys.reduce((accu: number[], sk: string) => {
                        const nextShuffleOrder = memory.get(sk, [])
                        return accu.length < nextShuffleOrder.length
                            ? nextShuffleOrder
                            : accu
                    }, [])

                    const shuffleItems = cache.get<string[]>(shuffleKey, [])

                    const toppedUpIndices = sortInStrategy(
                        cache.get<number[]>(ordKey, presetShuffle),
                        shuffleItems.length,
                    )

                    // order mix items
                    cache.fold(shuffleKey, (vs: string[]) => sortWithIndices(vs, toppedUpIndices), [])

                    // remove mixKey from ord pool
                    orderSet.delete(ok)

                    // possibly update with longer sort order
                    cache.set(ordKey, toppedUpIndices)
                    memory.set(shuffleKey, toppedUpIndices)
                }

                // need to remove ord deferred because it is persistent
                if (orderSet.size === 0) {
                    deferred.unregister(ordKey)
                }
            }, {
                priority: 35 /* must be higher than sequencers 15 */,
                persistent: true,
            })

        }

        return { ready: true }
    }

    registrar.register(tagname, ordFilter, { separators: [cmdSeparator, separator] })
}
