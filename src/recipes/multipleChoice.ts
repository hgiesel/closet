import type { TagData, Recipe, Internals, Ellipser, InactiveBehavior, ActiveBehavior, WeakSeparator } from './types'
import type { McClozePreset } from './mcClozeTemplate'
import type { SortInStrategy } from './sortInStrategies'

import { id, id2 } from './utils'
import { Stylizer } from './stylizer'
import { sequencer } from './sequencer'
import { noneEllipser } from './ellipser'
import { mcClozeTemplate } from './mcClozeTemplate'
import { topUp } from './sortInStrategies'

const activeBehavior= (sortIn: SortInStrategy): ActiveBehavior<McClozePreset, McClozePreset>  => (
    stylizer: Stylizer,
) => (tag: TagData, internals: Internals<McClozePreset>) => {
    const flattedValuesWithIndex = tag.values.flatMap((v: string[], i: number) => v.map((w: string) => [w, i]))

    const maybeValues = sequencer(
        `${tag.fullKey}:${tag.fullOccur}`,
        `${tag.fullKey}:${tag.fullOccur}`,
        flattedValuesWithIndex,
        sortIn,
        internals,
    )

    if (maybeValues) {
        return stylizer.stylize(
            maybeValues.map(v => v[0]),
            [maybeValues.map(v => v[1])],
        )
    }
}

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
const defaultContexter = (sortIn: (indices: number[], toLength: number) => number[]) => (tag: TagData, internals: Internals<McClozePreset>) => {
    const maybeValues = sequencer(
        `${tag.fullKey}:${tag.fullOccur}`,
        `${tag.fullKey}:${tag.fullOccur}`,
        tag.values[0],
        sortIn,
        internals,
    )

    if (maybeValues) {
        const stylizer = new Stylizer()
        return stylizer.stylize(maybeValues)
    }
}

const multipleChoicePublicApi = (
    choice1: InactiveBehavior<McClozePreset, McClozePreset>,
    choice2: InactiveBehavior<McClozePreset, McClozePreset>,
): Recipe<McClozePreset> => (options: {
    tagname?: string,
    switcherKeyword?: string,
    activateKeyword?: string,

    frontStylizer?: Stylizer,
    backStylizer?: Stylizer,

    sortInStrategy?: SortInStrategy,
    outerSeparator?: WeakSeparator,
    innerSeparator?: WeakSeparator,

    contexter?: Ellipser<McClozePreset>,
    ellipser?: Ellipser<McClozePreset>,
} = {})  => {
    const {
        tagname = 'mc',
        switcherKeyword = 'switch',
        activateKeyword = 'activate',
        frontStylizer = defaultFrontStylizer,
        backStylizer = defaultBackStylizer,
        sortInStrategy = topUp,
        outerSeparator = { sep: '::' },
        innerSeparator = { sep: '||' },
        contexter = defaultContexter(sortInStrategy),
        ellipser = noneEllipser,
    } = options

    const multipleChoiceSeparators = { separators: [outerSeparator, innerSeparator] }
    const theActiveBehavior = activeBehavior(sortInStrategy)

    const multipleChoiceRecipe = mcClozeTemplate(theActiveBehavior, theActiveBehavior, multipleChoiceSeparators)(choice1, choice2)

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

export const multipleChoiceShowRecipe = multipleChoicePublicApi(id, id)
export const multipleChoiceHideRecipe = multipleChoicePublicApi(id2, id2)
export const multipleChoiceRevealRecipe = multipleChoicePublicApi(id2, id)
