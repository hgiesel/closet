import type { WeakFilter, Recipe, Filters } from './types'

export const simpleRecipe = (ellipser: WeakFilter<{}>): Recipe<{}> => ({
    tagname,
}: {
    tagname: string,
}) => (filterApi: Filters<{}>) => {
    filterApi.register(tagname, ellipser)
}
