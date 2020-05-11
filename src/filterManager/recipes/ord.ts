import type {
    Tag
} from '../../tags'

import type {
    FilterApi
} from '../filters'

import type {
    Internals,
} from '..'

const ordRecipe = (keyword: string) => (filterApi: FilterApi) => {
    const ordFilter = (
        {}: Tag,
        {}: Internals,
    ) => {
    }

    filterApi.register(keyword, ordFilter as any)
}

export default ordRecipe
