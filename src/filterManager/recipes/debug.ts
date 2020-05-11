import type {
    FilterApi,
} from '../filters'

import type { Tag } from '../../tags'

const debugRecipe = (filterApi: FilterApi) => {
    const pathFilter = ({path}: Tag) => path.join(':')

    filterApi.register('tagpath', pathFilter as any)
    filterApi.register('never', (() => {}) as any) 
    filterApi.register('empty', (() => '') as any)
    filterApi.register('k', (({key}) => key) as any)
}

export default debugRecipe
