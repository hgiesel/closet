import type { TagData, Registrar } from './types'

import { Stylizer } from './stylizer'
import { id } from './utils'

export const styleRecipe = ({
    tagname = 's',
    stylizer = new Stylizer(),
    separator = '::',
} = {}) => (registrar: Registrar<{}>) => {
    const styleFilter = (tag: TagData) => {
        return stylizer.stylize(tag.values)
    }

    registrar.register(tagname, styleFilter, { separators: [separator] })
}

export const processRecipe = ({
    tagname = 's',
    processor = id,
} = {}) => (registrar: Registrar<{}>) => {
    const processorFilter = (tag: TagData) => {
        return processor(tag.values)
    }

    registrar.register(tagname, processorFilter, { separators: [] })
}
