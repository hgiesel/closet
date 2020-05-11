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
        { deferred, store}: Internals,
    ) => {
        let toBeOrdered = null

        if (valuesRaw.includes(',')) {
            toBeOrdered = valuesRaw.split(',').map(v => Number(v))
        }
        else {
            toBeOrdered = values[0].map(v => Number(v))
        }

        const mixKeys = toBeOrdered.map(v => `${mixKeyword}${v}:mix`)

        const ordKey = `${key}:${fullOccur}:ord`
        deferred.register(ordKey, () => {
        }, 40)

    }

    filterApi.register(keyword, ordFilter as any)
}

export default ordRecipe
