import type { Tag } from '../../tags'
import type { FilterApi } from '../filters'
import type { Internals } from '..'
import { InnerStylizer } from './stylizer'

export const clozeRecipe = (
    keyword: string,
    revealDecider: (t: Tag, inter: Internals) => boolean,
    currentDecider: (t: Tag, inter: Internals) => boolean,
    currentStylizer = new InnerStylizer(),
    ellipsis: string = '[...]',
) => (filterApi: FilterApi) => {
    const clozeFilter = (
        tag: Tag,
        inter: Internals,
    ) => {
        const willReveal = revealDecider(tag, inter)
        const isCurrent = currentDecider(tag, inter)

        if (isCurrent) {
        }

    }

    filterApi.register(keyword, clozeFilter)
}
