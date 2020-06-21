import type { TagData, FilterApi } from './types'

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
