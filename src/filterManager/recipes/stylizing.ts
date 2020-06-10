import type { Tag } from '../../tags'
import type { FilterApi } from '../filters'
import { FullStylizer } from './stylizer'

export const styleRecipe = ({
    tagname,
    stylizer = new FullStylizer(),
}) => (filterApi: FilterApi) => {
    const styleFilter = (
        { values }: Tag,
    ) => {
        return stylizer.stylizeFull(values)
    }

    filterApi.register(tagname, styleFilter as any)
}
