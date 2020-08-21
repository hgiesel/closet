import type { TagData, Recipe, Eval, Internals, InactiveBehavior, WeakFilter, WeakSeparator } from './types'
import type { FlashcardPreset, FlashcardTemplate } from './flashcardTemplate'
import type { SortInStrategy } from './sortInStrategies'
import type { StyleList } from './styleList'

import { Stylizer } from './stylizer'
import { acrossTag } from './sequencer'
import { makeFlashcardTemplate, generateFlashcardRecipes, ellipsis } from './flashcardTemplate'
import { listStylize, listStylizeMaybe } from './styleList'
import { topUp } from './sortInStrategies'

type ValuePlusCategory = [string, number]

const valuesWithIndex = <T extends {}>(
    tag: TagData,
    _internals: Internals<T>,
): ValuePlusCategory[] => {
    const flattedValuesWithIndex: ValuePlusCategory[] = tag
        .values
        .flatMap((v: string[], i: number) => v.map((w: string) => [w, i]))

    return flattedValuesWithIndex
}

const firstCategory = <T extends {}>(tag: TagData, _internals: Internals<T>): string[] => tag.values[0]

const inactive = new Stylizer()

const orangeCommaSeparated = inactive.toStylizer({
    processor: (v: string) => `( ${v} )`,
    mapper: (v: string) => {
        return `<span style="color: orange;">${v}</span>`
    },
})

const greenAndRed = orangeCommaSeparated.toStylizer({
    mapper: (v: string, _i, t: number) => {
        return `<span style="color: ${t === 0 ? 'lime' : 'red'};">${v}</span>`
    },
})

const multipleChoicePublicApi = <T extends FlashcardPreset>(
    frontInactive: InactiveBehavior<T>,
    backInactive: InactiveBehavior<T>,
): Recipe<T> => <V extends StyleList>(options: {
    tagname?: string,

    frontStylizer?: Stylizer,
    backStylizer?: Stylizer,

    inactiveStylizer?: Stylizer,
    contexter?: Eval<T, V>,
    ellipser?: WeakFilter<T>,

    getValues?: Eval<T, V>,
    sequence?: (getValues: Eval<T, V>, sortIn: SortInStrategy) => Eval<T, V | void>

    sortInStrategy?: SortInStrategy,
    categorySeparator?: WeakSeparator,
    valueSeparator?: WeakSeparator,

    flashcardTemplate?: FlashcardTemplate<T>,
} = {})  => {
    const {
        tagname = 'mc',

        frontStylizer = orangeCommaSeparated,
        backStylizer = greenAndRed,

        inactiveStylizer = inactive,
        contexter = firstCategory,
        ellipser = ellipsis,

        getValues = valuesWithIndex,

        sequence = acrossTag,
        sortInStrategy = topUp,

        categorySeparator = { sep: '::' },
        valueSeparator = { sep: '||' },

        flashcardTemplate = makeFlashcardTemplate(),
    } = options

    // @ts-ignore
    const shuffler: Eval<T, V | void> = sequence(getValues, sortInStrategy)

    const front = listStylizeMaybe(frontStylizer, shuffler)
    const back = listStylizeMaybe(backStylizer, shuffler)

    const multipleChoiceSeparators = { separators: [categorySeparator, valueSeparator] }
    const multipleChoiceRecipe = flashcardTemplate(frontInactive, backInactive)

    const trueContexter = listStylize(inactiveStylizer, contexter)

    return multipleChoiceRecipe(tagname, front, back, trueContexter, ellipser, multipleChoiceSeparators)
}

export const [
    multipleChoiceShowRecipe,
    multipleChoiceHideRecipe,
    multipleChoiceRevealRecipe,
] = generateFlashcardRecipes(multipleChoicePublicApi)
