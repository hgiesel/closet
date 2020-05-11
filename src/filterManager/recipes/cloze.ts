import type {
    Tag
} from '../../tags'

import type {
    FilterApi
} from '../filters'

import type {
    Internals,
} from '..'

const clozeRecipe = (keyword: string) => (filterApi: FilterApi) => {
    const clozeFilter = (
        {}: Tag,
        {}: Internals,
    ) => {
    }

    filterApi.register(keyword, clozeFilter as any)
}

export default clozeRecipe
