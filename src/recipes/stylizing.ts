import type { TagNode, Registrar } from './types'

import { Stylizer } from './stylizer'
import { id } from './utils'

export const styleRecipe = <T extends Record<string, unknown>>({
    tagname = 's',
    stylizer = Stylizer.make(),
    separator = '::',
} = {}) => (registrar: Registrar<T>) => {
    const styleFilter = (tag: TagNode) => {
        return stylizer.stylize(tag.values)
    }

    registrar.register(tagname, styleFilter, { separators: [separator] })
}

export const processRecipe = <T extends Record<string, unknown>>({
    tagname = 's',
    processor = id,
} = {}) => (registrar: Registrar<T>) => {
    const processorFilter = (tag: TagNode) => {
        return processor(tag.values)
    }

    registrar.register(tagname, processorFilter, { separators: [] })
}
