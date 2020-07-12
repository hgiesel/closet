import type { WeakFilter, Recipe, Registrar } from './types'

export const simpleRecipe = <T extends {}>(weakFilter: WeakFilter<T>): Recipe<T> => ({
    tagname = 's',
}: {
    tagname?: string,
} = {}) => (registrar: Registrar<T>) => {
    registrar.register(tagname, weakFilter)
}
