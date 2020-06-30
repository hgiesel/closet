import type { Registrar, TagData, WeakFilterResult } from './types'

const paramPattern = /%(.)/gu
const defOptions = { separators: [{ sep: '::', max: 2 }], capture: true }

const matcher = (argTag: TagData) => (match: string, p1: string) => {
    console.log('foo', match, p1)

    const num = Number(p1)
    if (Number.isNaN(num)) {
        switch (p1) {
            case '%':
                return p1
            case 'n':
                return argTag.num ? String(argTag.num) : ''
            case 'k':
                return argTag.key
            case 'f':
                return argTag.fullKey

            default:
                return match
        }
    }

    if (num >= 0) {
        return argTag.valuesText ? argTag.values[num] : ''
    }
}

export const defRecipe = () => (registrar: Registrar<{}>) => {
    const innerOptions = { separators: [{ sep: '::' }] }

    const defFilter = (tag: TagData): WeakFilterResult => {
        const [
            definedTag,
            template,
        ] = tag.values

        const innerFilter = (tag: TagData) => {
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
