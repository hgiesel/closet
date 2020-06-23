import type { TagData, Filters } from './types'

import { Stylizer } from './stylizer'

export const styleRecipe = ({
    tagname,
    stylizer = new Stylizer(),
    separator = '::',
}) => (filterApi: Filters<{}>) => {
    const styleFilter = (tag: TagData) => {
        return stylizer.stylize(tag.values(separator))
    }

    filterApi.register(tagname, styleFilter as any)
}
