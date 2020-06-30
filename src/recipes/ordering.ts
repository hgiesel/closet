import type { TagData, Registrar, Internals } from './types'

import {
    toNumbers,
    sortWithIndices,
    topUpSortingIndices,
} from './utils'

export const orderingRecipe = ({
    tagname = 'ord',
    shuffleTagname = 'mix',
} = {}) => (registrar: Registrar<{}>) => {
    const ordFilter = (tag: TagData, { deferred, cache }: Internals<{}>) => {
        // mixes occupied by other ords
        const ordOccupiedKey = `${tag.key}:ord:occupied`

        const toBeOrdered = toNumbers(tag.values)
            .filter((v: number) => !cache.get<number[]>(ordOccupiedKey, []).includes(v))

        cache.fold(ordOccupiedKey, (v: number[]) => v.concat(toBeOrdered), [])

        const mixKeys = new Set(
            toBeOrdered.map((v: number) => `${shuffleTagname}${v}`)
        )

        const ordKey = `${tag.key}:${tag.fullOccur}:ord`

        deferred.register(ordKey, () => {
            const finishedKeys: string[] = []

            for (const mk of mixKeys) {
                deferred.block(`${mk}:mix`)

                const waitingSet = cache.get<Set<string>>(`${mk}:waitingSet`, new Set())

                if (waitingSet.size !== 0) {
                    continue
                }

                const mixItems = cache.get<string[]>(mk, [])
                const toppedUpIndices = topUpSortingIndices(
                    cache.get<number[]>(ordKey, []),
                    mixItems.length,
                )

                // order mix items
                cache.fold(mk, (vs: string[]) => sortWithIndices(vs, toppedUpIndices), [])

                // mark this mix tag as done
                finishedKeys.push(mk)

                // possibly update with longer sort order
                cache.set(ordKey, toppedUpIndices)
            }

            // remove mixKey from ord pool
            finishedKeys.forEach(fk => mixKeys.delete(fk))

            // need to remove ord deferred because it is persistent
            if (mixKeys.size === 0) {
                deferred.unregister(ordKey)
            }
        }, {
            priority: 35,
            persistent: true
        })

        return ''
    }

    registrar.register(tagname, ordFilter, { separators: [','] })
}
