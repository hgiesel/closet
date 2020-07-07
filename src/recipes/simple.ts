import type { WeakFilter, Recipe, Registrar } from './types'

export const simpleRecipe = <T extends object>(weakFilter: WeakFilter<T>): Recipe<T> => ({
    tagname,
}: {
    tagname: string,
}) => (registrar: Registrar<{}>) => {
    registrar.register(tagname, weakFilter)
}
