import type { Tag } from '../../tags'
import type { FilterApi } from '../filters'
import type { Internals } from '..'

export const mcRecipe = (keyword: string) => (filterApi: FilterApi) => {
    const mcFilter = (
        {}: Tag,
        {}: Internals,
    ) => {
    }

    filterApi.register(keyword, mcFilter as any)
}
