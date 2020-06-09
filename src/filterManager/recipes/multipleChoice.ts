import type { Tag } from '../../tags'
import type { FilterApi } from '../filters'
import type { Internals } from '..'
import { InnerStylizer } from './stylizer'
import { fourWayRecipe } from './nway'
import { isBack, isActive } from './deciders'

const defaultStylizer = new InnerStylizer({
    postprocess: v => `<span style="color: cornflowerblue;">${v}</span>`,
})

const defaultEllipsisMaker = ({ values }: Tag, _inter: Internals, _isActive: boolean): string => {
    return '[' + (
        values[1] ? values[1].join('||') : '...'
    ) + ']'
}

export const multipleChoiceHideRecipe = (
    keyword: string,

    currentStylizer = defaultStylizer,
    ellipsisMaker = defaultEllipsisMaker,
) => (filterApi: FilterApi) => {
    const makeEllipsis = (tag: Tag, inter: Internals) => ellipsisMaker(tag, inter, false)

    const multipleChoiceRecipe = fourWayRecipe(
        keyword,
        isBack,
        isActive,
        /* back */
        (tag) => currentStylizer.stylizeInner(tag.values[0]),
        makeEllipsis,
        /* front */
        (tag, inter) => currentStylizer.stylizeInner([
            ellipsisMaker(tag, inter, true)
        ]),
        makeEllipsis,
    )

    multipleChoiceRecipe(filterApi)
}

export const multipleChoiceShowRecipe = (
    keyword: string,

    currentStylizer = defaultStylizer,
    ellipsisMaker = defaultEllipsisMaker,
) => (filterApi: FilterApi) => {
    const valueJoiner = ({ values }: Tag) => values[0].join('||')

    const multipleChoiceRecipe = fourWayRecipe(
        keyword,
        isBack,
        isActive,
        /* back */
        (tag) => currentStylizer.stylizeInner(tag.values[0]),
        valueJoiner,
        /* front */
        (tag, inter) => currentStylizer.stylizeInner([
            ellipsisMaker(tag, inter, true)
        ]),
        valueJoiner,
    )

    multipleChoiceRecipe(filterApi)
}

