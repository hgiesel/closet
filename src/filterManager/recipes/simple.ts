import type { WeakFilter, Recipe, FilterApi } from './types'

export const simpleRecipe = (ellipser: WeakFilter): Recipe => ({
    tagname,
}: {
    tagname: string,
}) => (filterApi: FilterApi) => {
    filterApi.register(tagname, ellipser)
}
