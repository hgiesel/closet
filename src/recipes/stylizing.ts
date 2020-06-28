import type { TagData, Filters } from './types'

import { Stylizer } from './stylizer'
import { id } from './utils'

export const styleRecipe = ({
    tagname = 's',
    stylizer = new Stylizer(),
    separator = '::',
} = {}) => (filterApi: Filters<{}>) => {
    const styleFilter = (tag: TagData) => {
        return stylizer.stylize(tag.values)
    }

    filterApi.register(tagname, styleFilter, { separators: [separator] })
}

export const processRecipe = ({
    tagname = 's',
    processor = id,
} = {}) => (filterApi: Filters<{}>) => {
    const processorFilter = (tag: TagData) => {
        return processor(tag.values)
    }

    filterApi.register(tagname, processorFilter, { separators: [] })
}
