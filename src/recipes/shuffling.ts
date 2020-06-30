import type { TagData, Registrar, Internals } from './types'

import { Stylizer } from './stylizer'
import { sequencer } from './sequencer'

export const shufflingRecipe = ({
    tagname = 'mix',
    stylizer = new Stylizer(),
} = {}) => (registrar: Registrar<{}>) => {
    const shuffleFilter = (tag: TagData, internals: Internals<{}>) => {
        const unitId = `${tag.fullKey}:${tag.fullOccur}`
        const sequenceId = tag.num ? tag.fullKey : unitId

        const maybeValues = sequencer(
            unitId,
            sequenceId,
            tag.values,
            internals,
        )

        if (maybeValues) {
            return stylizer.stylize(maybeValues)
        }
    }

    registrar.register(tagname, shuffleFilter, { separators: ['||']})
}
