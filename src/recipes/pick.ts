import { Registrar } from './types'

export const pickRecipe = ({
    tagname = 'pick',
    storeId = 'lists',
    separator = { sep: ',' },
} = {}) => <T extends Record<string, unknown>>(registrar: Registrar<T>) => {
}
