import type { TagData } from '../../tags'
import type { FilterApi } from '../filters'
import { Stylizer } from './stylizer'

export const styleRecipe = ({
    tagname,
    stylizer = new Stylizer(),
    separator = '::',
}) => (filterApi: FilterApi) => {
    const styleFilter = (tag: TagData) => {
        return stylizer.stylize(tag.values(separator))
    }

    filterApi.register(tagname, styleFilter as any)
}
