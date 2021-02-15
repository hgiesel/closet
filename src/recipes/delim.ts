import type { Registrar, TagNode, Internals, WeakFilterResult } from '../types'

import { separated } from "../template/optics"


const delimOptions = { separators: [separated({ sep: '::', max: 3 })], capture: true }

export const delimRecipe = (options: {
    tagname?: string,
} = {}) => <T extends Record<string, unknown>>(registrar: Registrar<T>) => {
    const {
        tagname = 'delim',
    } = options

    const delimFilter = (tag: TagNode, { template, isCapture }: Internals<T>): WeakFilterResult => {
        if (isCapture) {
            const [
                open,
                close,
                innerTemplate,
            ] = tag.values

            template.parser.update({ open, close })

            return {
                result: innerTemplate,
                parse: true,
            }
        }

        // Reset delimiters
        template.parser.update()

        return {
            result: tag.innerNodes,
        }
    }

    registrar.register(tagname, delimFilter, delimOptions)
}
