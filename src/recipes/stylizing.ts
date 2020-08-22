import type { TagData, Registrar } from './types'

import { Stylizer } from './stylizer'
import { id } from './utils'

export const styleRecipe = <T extends {}>({
    tagname = 's',
    stylizer = Stylizer.make(),
    separator = '::',
} = {}) => (registrar: Registrar<T>) => {
    const styleFilter = (tag: TagData) => {
        return stylizer.stylize(tag.values)
    }

    registrar.register(tagname, styleFilter, { separators: [separator] })
}

export const processRecipe = <T extends {}>({
    tagname = 's',
    processor = id,
} = {}) => (registrar: Registrar<T>) => {
    const processorFilter = (tag: TagData) => {
        return processor(tag.values)
    }

    registrar.register(tagname, processorFilter, { separators: [] })
}
