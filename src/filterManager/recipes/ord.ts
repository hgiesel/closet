import type {
    Tag
} from '../../tags'

import type {
    FilterApi
} from '../filters'

import type {
    Internals,
} from '..'

const ordRecipe = (keyword: string, mixKeyword: string) => (filterApi: FilterApi) => {
    const ordFilter = (
        { key, fullOccur, values, valuesRaw }: Tag,
        { deferred, store }: Internals,
    ) => {
        const toBeOrdered = (valuesRaw.includes(',')
            ? valuesRaw.split(',')
            : values[0])
            .map((v: string) => Number(v))
            .filter((v: number) => !isNaN(v))

        const mixKeys = toBeOrdered.map((v: number) => `${mixKeyword}${v}:mix`)
        const waitingSetKeys = toBeOrdered.map((v: number) => `${mixKeyword}${v}:waitingList`)

        const ordKey = `${key}:${fullOccur}:ord`

        deferred.register(ordKey, () => {
            for (const key of mixKeys) {
                deferred.block(key)
            }

            const waitingSetsEmpty = waitingSetKeys
                .map((wst: string) => store.get(wst, new Set()) as Set<string>)
                .reduce(
                    (accu: boolean, v: Set<string>): boolean => accu && v.size === 0,
                    true,
                )

            if (!waitingSetsEmpty) {
                return
            }

            // store.fold(fullKey, shuffle, [])
        }, {
            priority: 35,
            persistent: true
        })

    }

    filterApi.register(keyword, ordFilter as any)
}

export default ordRecipe
