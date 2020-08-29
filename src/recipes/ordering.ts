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
         * @param tag.values must contain lists of sequence ids (!), not tagnames
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

            const orderKeys = new Set(toBeOrdered)
            const ordKey = `${tag.key}:${tag.fullOccur}:ord:${idx}`

            deferred.register(ordKey, () => {
                for (const ok of orderKeys) {
                    deferred.block(`${ok}:shuffle`)

                    const waitingSet = cache.get<Set<string>>(`${ok}:waitingSet`, new Set())
                    const shuffleKey = `${ok}:shuffle`

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
                    orderKeys.delete(ok)

                    // possibly update with longer sort order
                    cache.set(ordKey, toppedUpIndices)
                    memory.set(shuffleKey, toppedUpIndices)
                }

                // need to remove ord deferred because it is persistent
                if (orderKeys.size === 0) {
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
