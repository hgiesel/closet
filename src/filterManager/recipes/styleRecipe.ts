import type {
    Tag
} from '../../tags'

import type {
    FilterApi
} from '../filters'

import Stylizer from './stylizer'

const styleRecipe = (
    keyword: string,
    stylizer = new Stylizer(),
) => (filterApi: FilterApi) => {
    const styleFilter = (
        {values}: Tag,
    ) => {
        return stylizer.stylize(values)
    }

    filterApi.register(keyword, styleFilter as any)
}

export default styleRecipe
