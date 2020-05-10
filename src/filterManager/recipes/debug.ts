import type {
    FilterApi,
} from '../filters'

import type { Tag } from '../../tags'

const debugRecipe = (filterApi: FilterApi) => {

    const pathFilter = ({path}: Tag) => path.join(':')
    filterApi.register('tagpath', pathFilter as any)

    const testFilter = ({}: Tag, {tag}) => {
        console.log(tag.getPath([0]))
        return ''
    }

    filterApi.register('test', testFilter as any)
}

export default debugRecipe
