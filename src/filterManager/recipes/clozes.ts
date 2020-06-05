import type { Tag } from '../../tags'
import type { FilterApi } from '../filters'
import type { Internals } from '..'
import { InnerStylizer } from './stylizer'
import { fourWayRecipe } from './nway'

const isBack = (_t: Tag, { preset }: Internals) => {
    return preset['side'] === 'back'
}

const isCurrent = ({ num }: Tag, { preset }: Internals) => {
    if (num === null) {
        return true
    }

    else if (!preset['card']) {
        return false
    }

    const cardNumber = preset['card'].match(/[0-9]*$/)
    return Number(cardNumber) === num
}

const defaultStylizer = new InnerStylizer({
    postprocess: v => `<span style="color: cornflowerblue;">${v}</span>`,
})


const defaultEllipsisMaker = ({ values }: Tag, _inter: Internals, _isCurrent: boolean): string => {
    return values[1] ? values[1].join('||') : '[...]'
}


export const clozeHideRecipe = (
    keyword: string,

    currentStylizer = defaultStylizer,
    ellipsisMaker = defaultEllipsisMaker,
) => (filterApi: FilterApi) => {
    const makeEllipsis = (tag: Tag, inter: Internals) => ellipsisMaker(tag, inter, false)

    const clozeRecipe = fourWayRecipe(
        keyword,
        isBack,
        isCurrent,
        /* back */
        (tag) => currentStylizer.stylizeInner(tag.values[0]),
        makeEllipsis,
        /* front */
        (tag, inter) => currentStylizer.stylizeInner([
            ellipsisMaker(tag, inter, true)
        ]),
        makeEllipsis,
    )

    clozeRecipe(filterApi)
}

export const clozeShowRecipe = (
    keyword: string,

    currentStylizer = defaultStylizer,
    ellipsisMaker = defaultEllipsisMaker,
) => (filterApi: FilterApi) => {
    const valueJoiner = ({ values }: Tag) => values[0].join('||')

    const clozeRecipe = fourWayRecipe(
        keyword,
        isBack,
        isCurrent,
        /* back */
        (tag) => currentStylizer.stylizeInner(tag.values[0]),
        valueJoiner,
        /* front */
        (tag, inter) => currentStylizer.stylizeInner([
            ellipsisMaker(tag, inter, true)
        ]),
        valueJoiner,
    )

    clozeRecipe(filterApi)
}
