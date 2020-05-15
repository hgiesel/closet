import type {
    FilterApi,
    FilterResult,
} from '../filters'

import type {
    Tag,
} from '../../tags'

const paramPattern = /%(\d*)/u

const metaRecipe = (filterApi: FilterApi) => {

    filterApi.register('def', ({ values }: Tag, { filters }): FilterResult => {
        const outerValues = values

        filters.register(values[0][0], ({ values }: Tag) => {
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

                                return values[paramNo]
                                    ? values[paramNo].join('||')
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

export default metaRecipe
