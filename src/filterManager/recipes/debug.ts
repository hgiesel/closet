import type {
    FilterApi,
} from '../filters'

import type { Tag } from '../../tags'

const debugRecipe = (filterApi: FilterApi) => {
    const pathFilter = ({path}: Tag) => path.join(':')

    filterApi.register('tagpath', pathFilter)
    filterApi.register('never', (() => {}))
    filterApi.register('empty', (() => ''))
    filterApi.register('key', (({key}: Tag) => key))
}

export default debugRecipe
