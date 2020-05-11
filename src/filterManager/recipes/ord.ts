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
        {values, valuesRaw}: Tag,
        {}: Internals,
    ) => {
        let toBeOrdered = null

        if (valuesRaw.includes(',')) {
            toBeOrdered = valuesRaw.split(',').map(v => Number(v))
        }
        else {
            toBeOrdered = values[0].map(v => Number(v))
        }


    }

    filterApi.register(keyword, ordFilter as any)
}

export default ordRecipe
