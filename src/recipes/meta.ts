import type { Filters, TagData, Internals, WeakFilterResult } from './types'

const paramPattern = /%(\d*)/u
const metaSeparators = { separators: [{ sep: '::' }, { sep: '||' }]}

export const metaRecipe = () => (filterApi: Filters<{}>) => {
    const metaFilter = (tag: TagData, { filters }: Internals<{}>): WeakFilterResult => {
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

        filters.register(outerValues[0][0], innerFilter, metaSeparators)

        return {
            ready: true,
        }
    }

    filterApi.register('def', metaFilter, metaSeparators)
}
