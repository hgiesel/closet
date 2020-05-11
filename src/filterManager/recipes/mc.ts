import type {
    Tag
} from '../../tags'

import type {
    FilterApi
} from '../filters'

import type {
    Internals,
} from '..'

const mcRecipe = (keyword: string) => (filterApi: FilterApi) => {
    const mcFilter = (
        {}: Tag,
        {}: Internals,
    ) => {
    }

    filterApi.register(keyword, mcFilter as any)
}

export default mcRecipe
