import type { TagNode, Registrar, Internals, Eval } from '../types'

import { Stylizer } from '../stylizer'
import { acrossTag, withinTag } from '../sequencers'
import { topUp } from '../sortInStrategies'

import { separated } from "../template/optics"


const defaultStylizer = Stylizer.make({
    processor: (s: string) => `<span class="closet-shuffle">${s}</span>`,
    mapper: (s: string) => `<span class="closet-shuffle__item">${s}</span>`,
    separator: '<span class="closet-shuffle__separator"></span>',
})

export const shufflingRecipe = ({
    tagname = 'mix',
    stylizer = defaultStylizer,
    sortInStrategy = topUp,
    optics = [separated("||")],
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

    registrar.register(tagname, shuffleFilter, { optics })
}
