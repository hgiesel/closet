export type StoreGetter<T> = { get: (key: string, num: number | null | undefined, occur: number) => T }

export const constantGet = <T>(v: T): StoreGetter<T> => ({ get: () => v })

export { setNumberRecipe } from './numberStore'
export { activateRecipe, deactivateRecipe } from './boolStore'
