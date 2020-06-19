import type { FilterApi, FilterResult } from '../filters'
import type { TagData } from '../../tags'

const paramPattern = /%(\d*)/u

export const metaRecipe = () => (filterApi: FilterApi) => {
    filterApi.register('def', (tag: TagData, { filters }): FilterResult => {
        const outerValues = tag.values('::', '||')

        filters.register(outerValues[0][0], (tag: TagData) => {
            const innerValues = tag.values('::', '||')

            return {
                result: '[[' + outerValues
                    .slice(1)
                    .map((vs: string[]) => {
                        return vs.map((v: string): string => {
                            const match = v.match(paramPattern)

                            if (match) {
                                const paramNo = match[1].length === 0
                                    ? 0
                                    : Number(match[1])

                                return innerValues[paramNo]
                                    ? innerValues[paramNo].join('||')
                                    : ''
                            }

                            return v
                        }).join('||')
                    })
                    .join('::') + ']]',
                ready: false,
            }
        })

        return {
            result: '',
            ready: false,
        }
    })
}
