import type {
    FilterApi,
} from '../filters'

import type { Tag } from '../../tags'

const debugRecipe = (filterApi: FilterApi) => {

    const pathFilter = ({path}: Tag) => path.join(':')

    const testFilter = ({}: Tag, {tag}) => {
        console.log(tag.getPath([0]))
        return ''
    }

    filterApi.register('tagpath', pathFilter as any)
    filterApi.register('test', testFilter as any)
    filterApi.register('notready', (() => {}) as any) 
}

export default debugRecipe
