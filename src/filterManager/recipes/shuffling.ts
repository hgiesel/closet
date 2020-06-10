import type { Tag, FilterApi, Internals } from './types'

import { Stylizer } from './stylizer'
import { sequencer } from './sequencer'

export const shufflingRecipe = ({
    tagname,
    stylizer = new Stylizer(),
}) => (filterApi: FilterApi) => {
    const shuffleFilter = (
        { fullKey, key, num, fullOccur, values }: Tag,
        internals: Internals,
    ) => {
        const maybeValues = sequencer(
            `${fullKey}:${fullOccur}`,
            num ? fullKey : `${key}:${fullOccur}`,
            values[0],
            internals,
        )

        if (maybeValues) {
            return stylizer.stylize(maybeValues)
        }
    }

    filterApi.register(tagname, shuffleFilter as any)
}
