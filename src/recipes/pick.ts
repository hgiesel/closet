import { Registrar } from './types'

export const pickRecipe = ({
    tagname = 'pick',
    storeId = 'lists',
    separator = { sep: ',' },
} = {}) => <T extends {}>(registrar: Registrar<T>) => {
}
