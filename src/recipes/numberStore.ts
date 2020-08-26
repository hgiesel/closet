import type { Registrar } from './types'

import {
    ValueStore,
    valueStoreTemplate,
    defaultSeparator,
    innerSeparator
} from './valueStore'

class NumberStore extends ValueStore<number> {
    setNumber(selector: string, value: number): void {
        this.set(selector, Number.isNaN(value) ? 0 : value)
    }
}

const numStoreFilterTemplate = valueStoreTemplate(NumberStore)

export const setNumberRecipe = <T extends {}>({
    tagname = 'set',
    storeId = 'numerical',
    separator = defaultSeparator,
    assignmentSeparator = innerSeparator,
} = {}) => (registrar: Registrar<T>) => registrar.register(
    tagname,
    numStoreFilterTemplate(
        storeId,
        0,
        (selector, val) => (numberMap) => numberMap.setNumber(selector, Number(val)),
    ), {
        separators: [separator, assignmentSeparator],
    },
)
