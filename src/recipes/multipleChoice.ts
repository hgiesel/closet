import type { TagData, Recipe, Internals, Ellipser, ActiveBehavior } from './types'
import type { McClozePreset } from './mcClozeTemplate'

import { id, id2 } from './utils'
import { Stylizer } from './stylizer'
import { sequencer } from './sequencer'
import { noneEllipser } from './ellipser'
import { mcClozeTemplate } from './mcClozeTemplate'

const activeBehavior: ActiveBehavior<McClozePreset, McClozePreset> = (
    stylizer: Stylizer,
) => (tag: TagData, internals: Internals<McClozePreset>) => {
    const flattedValuesWithIndex = tag.values.flatMap((v: string[], i: number) => v.map((w: string) => [w, i]))

    const maybeValues = sequencer(
        `${tag.fullKey}:${tag.fullOccur}`,
        `${tag.fullKey}:${tag.fullOccur}`,
        flattedValuesWithIndex,
        internals,
    )

    if (maybeValues) {
        return stylizer.stylize(
            maybeValues.map(v => v[0]),
            [maybeValues.map(v => v[1])],
        )
    }
}

const multipleChoiceSeparators = { separators: [{ sep: '::' }, { sep: '||' }]}

const multipleChoiceRecipe = mcClozeTemplate(activeBehavior, activeBehavior, multipleChoiceSeparators)

const defaultFrontStylizer = new Stylizer({
    separator: ', ',
    mapper: (v: string) => {
        return `<span style="color: orange;">${v}</span>`
    },
    processor: (v: string) => `( ${v} )`,
})

const defaultBackStylizer = defaultFrontStylizer.toStylizer({
    mapper: (v: string, _i, t: number) => {
        return `<span style="color: ${t === 0 ? 'lime' : 'red'};">${v}</span>`
    },
})

const defaultContexter = (tag: TagData, internals: Internals<McClozePreset>) => {
    const maybeValues = sequencer(
        `${tag.fullKey}:${tag.fullOccur}`,
        `${tag.fullKey}:${tag.fullOccur}`,
        tag.values[0],
        internals,
    )

    if (maybeValues) {
        const stylizer = new Stylizer()
        return stylizer.stylize(maybeValues)
    }
}

const multipleChoicePublicApi = (
    multipleChoiceRecipe: Recipe<McClozePreset>,
): Recipe<McClozePreset> => (options: {
    tagname?: string,
    switcherKeyword?: string,
    activateKeyword?: string,

    frontStylizer?: Stylizer,
    backStylizer?: Stylizer,

    contexter?: Ellipser<McClozePreset>,
    ellipser?: Ellipser<McClozePreset>,
} = {})  => {
    const {
        tagname = 'mc',
        switcherKeyword = 'switch',
        activateKeyword = 'activate',
        frontStylizer = defaultFrontStylizer,
        backStylizer = defaultBackStylizer,
        contexter = defaultContexter,
        ellipser = noneEllipser,
    } = options

    return multipleChoiceRecipe({
        tagname: tagname,
        switcherKeyword: switcherKeyword,
        activateKeyword: activateKeyword,

        frontStylizer: frontStylizer,
        backStylizer: backStylizer,

        contexter: contexter,
        activeEllipser: ellipser,
        inactiveEllipser: ellipser,
    })
}

export const multipleChoiceShowRecipe = multipleChoicePublicApi(multipleChoiceRecipe(id, id))
export const multipleChoiceHideRecipe = multipleChoicePublicApi(multipleChoiceRecipe(id2, id2))
export const multipleChoiceRevealRecipe = multipleChoicePublicApi(multipleChoiceRecipe(id2, id))
