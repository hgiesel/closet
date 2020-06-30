import type { WeakFilter, Recipe, Registrar } from './types'

export const simpleRecipe = (ellipser: WeakFilter<{}>): Recipe<{}> => ({
    tagname,
}: {
    tagname: string,
}) => (registrar: Registrar<{}>) => {
    registrar.register(tagname, ellipser)
}
