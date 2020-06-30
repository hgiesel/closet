import type { Registrar, TagData, WeakFilterResult } from './types'

const paramPattern = /%(\d*)/u
const metaSeparators = { separators: [{ sep: '::' }, { sep: '||' }]}

export const metaRecipe = () => (registrar: Registrar<{}>) => {
    const metaFilter = (tag: TagData): WeakFilterResult => {
        const outerValues = tag.values

        const innerFilter = (tag: TagData) => {
            const innerValues = tag.values

            const result = '[[' + outerValues
                .slice(1)
                .map((vs: string[]) => {
                    return vs.map((v: string): string => {
                        const match = v.match(paramPattern)

                        if (match) {
                            const paramNo = match[1].length === 0
                                ? 0
                                : Number(match[1])

                            return innerValues && innerValues[paramNo]
                                ? innerValues[paramNo].join('||')
                                : ''
                        }

                        return v
                    }).join('||')
                })
                .join('::') + ']]'


            return {
                result: result,
                containsTags: true,
            }
        }

        registrar.register(outerValues[0][0], innerFilter, metaSeparators)

        return {
            ready: true,
        }
    }

    registrar.register('def', metaFilter, metaSeparators)
}
