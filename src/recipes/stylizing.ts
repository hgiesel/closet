import type { TagData, Filters } from './types'

import { Stylizer } from './stylizer'

export const styleRecipe = ({
    tagname = 's',
    stylizer = new Stylizer(),
    separators = ['::'],
} = {}) => (filterApi: Filters<{}>) => {
    const styleFilter = (tag: TagData) => {
        return stylizer.stylize(tag.values)
    }

    filterApi.register(tagname, styleFilter as any, { separators: separators })
}
