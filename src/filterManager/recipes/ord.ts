import type {
    Tag
} from '../../tags'

import type {
    FilterApi
} from '../filters'

import type {
    Internals,
} from '..'

import {
    allowCommaStyle,
    toNumbers,
    sortWithIndices,
    topUpSortingIndices,
} from './utils'

const ordRecipe = (keyword: string, mixKeyword: string) => (filterApi: FilterApi) => {
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
            toBeOrdered.map((v: number) => `${mixKeyword}${v}`)
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

    filterApi.register(keyword, ordFilter as any)
}

export default ordRecipe
