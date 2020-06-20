import type { TagData, FilterApi, Internals } from './types'

import { Stylizer } from './stylizer'
import { sequencer } from './sequencer'

export const shufflingRecipe = ({
    tagname,
    stylizer = new Stylizer(),
}) => (filterApi: FilterApi) => {
    const shuffleFilter = (tag: TagData, internals: Internals) => {
        const maybeValues = sequencer(
            `${tag.fullKey}:${tag.fullOccur}`,
            tag.num ? tag.fullKey : `${tag.key}:${tag.fullOccur}`,
            tag.values,
            internals,
        )

        if (maybeValues) {
            return stylizer.stylize(maybeValues)
        }
    }

    filterApi.register(tagname, shuffleFilter as any, ['::', '||'])
}
