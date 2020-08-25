import type { Registrar, TagNode, WeakFilterResult } from './types'

const paramPattern = /%(.)/gu
const defOptions = { separators: [{ sep: '::', max: 2 }], capture: true }

const matcher = (tag: TagNode) => (match: string, p1: string) => {
    switch (p1) {
        case '%':
            return p1

        case 'n':
            return typeof tag.num === 'number'
                ? String(tag.num)
                : ''

        case 'k':
            return tag.key
        case 'f':
            return tag.fullKey

        default:
            const num = Number(p1)

            return Number.isNaN(num)
                ? match
                : tag.values[num] ?? ''
    }
}

export const defRecipe = () => <T extends {}>(registrar: Registrar<T>) => {
    const innerOptions = { separators: [{ sep: '::' }] }

    const defFilter = (tag: TagNode): WeakFilterResult => {
        const [
            definedTag,
            template,
        ] = tag.values

        const innerFilter = (tag: TagNode) => {
            const result = template.replace(paramPattern, matcher(tag))

            return {
                result: result,
                containsTags: true,
            }
        }

        registrar.register(definedTag, innerFilter, innerOptions)

        return {
            result: '',
        }
    }

    registrar.register('def', defFilter, defOptions)
}
