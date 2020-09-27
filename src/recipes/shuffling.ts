import type { TagNode, Registrar, Internals, Eval } from './types'

import { Stylizer } from './stylizer'
import { acrossTag, withinTag } from './sequencer'
import { topUp } from './sortInStrategies'


const shufflingRecipe = ({
    tagname = 'mix',
    stylizer = Stylizer.make(),
    sortInStrategy = topUp,
} = {}) => <T extends Record<string, unknown>>(registrar: Registrar<T>) => {
    const shuffleFilter = (tag: TagNode, internals: Internals<T>) => {
        const sequence = tag.num
            ? acrossTag
            : withinTag

        const getValues: Eval<T, string[]> = ({ values }: TagNode): string[] => values ?? []

        const shuffler: Eval<T, string[] | void> = sequence(
            getValues as any,
            sortInStrategy,
        ) as Eval<T, string[] | void>

        const maybeValues = shuffler(tag, internals)
        if (maybeValues) {
            return stylizer.stylize(maybeValues)
        }
    }

    registrar.register(tagname, shuffleFilter, { separators: ['||'] })
}

const shuffling = {
    shuffle: shufflingRecipe,
}

export default shuffling
