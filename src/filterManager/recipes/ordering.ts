import type { Tag, FilterApi, Internals } from './types'

import {
    allowCommaStyle,
    toNumbers,
    sortWithIndices,
    topUpSortingIndices,
} from './utils'

export const orderingRecipe = ({
    tagname,
    mixTagname,
}) => (filterApi: FilterApi) => {
    const ordFilter = (
        { key, fullOccur, values, valuesRaw }: Tag,
        { deferred, cache }: Internals,
    ) => {
        // mixes occupied by other ords
        const ordOccupiedKey = `${key}:ord:occupied`

        const toBeOrdered = toNumbers(allowCommaStyle(values, valuesRaw))
            .filter((v: number) => !(cache.get(ordOccupiedKey, []) as number[]).includes(v))

        cache.fold(ordOccupiedKey, (v: number[]) => v.concat(toBeOrdered), [])

        const mixKeys = new Set(
            toBeOrdered.map((v: number) => `${mixTagname}${v}`)
        )

        const ordKey = `${key}:${fullOccur}:ord`

        deferred.register(ordKey, () => {
            const finishedKeys = []

            for (const mk of mixKeys) {
                deferred.block(`${mk}:mix`)

                const waitingSet = (cache.get(`${mk}:waitingSet`, new Set()) as Set<string>)

                if (waitingSet.size !== 0) {
                    continue
                }

                const mixItems = cache.get(mk, []) as string[]
                const toppedUpIndices = topUpSortingIndices(
                    cache.get(ordKey, []) as number[],
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

    filterApi.register(tagname, ordFilter as any)
}
