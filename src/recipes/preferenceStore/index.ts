export type StoreGetter<T> = { get: (key: string, num: number | null | undefined, occur: number) => T }

export const constantGet = <T>(v: T): StoreGetter<T> => ({ get: () => v })

import { setNumberRecipe } from './numberStore'
import { activateRecipe, deactivateRecipe } from './boolStore'

const preferenceStore = {
    setNumber: setNumberRecipe,
    activate: activateRecipe,
    deactivate: deactivateRecipe,
}

export default preferenceStore
