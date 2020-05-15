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
} from './utils'

const topUpSortingIndices = (indices: number[], toLength: number): number[] => {
    if (indices.length >= toLength) {
        // indices already have sufficient length
        return indices
    }

    const newIndices = Array.from(
        new Array(toLength - indices.length),
        (_x: undefined, i: number) => i + indices.length,
    )

    const result = [...indices]
    newIndices.forEach(
        (newIndex: number) => result.splice(
            Math.floor(Math.random() * (result.length + 1)) /* possible insertion positions */,
            0,
            newIndex,
        )
    )

    return result
}

const sortWithIndices = <T>(items: T[], indices: number[]): T[] => {
    const result = []

    for (const idx of indices) {
        const maybeItem = items[idx]

        if (maybeItem) {
            result.push(maybeItem)
        }
    }

    if (indices.length < items.length) {
        const remainingItemIndices: number[] = Array.from(
            new Array(items.length - indices.length),
            (_x, i) => i + indices.length
        )

        for (const idx of remainingItemIndices) {
            result.push(items[idx])
        }
    }

    return result
}

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
