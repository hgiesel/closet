import type { Registrar } from './types'

import { ValueStore, valueStoreTemplate } from './valueStore'

class NumberStore extends ValueStore<number> {
    setNumber(at: string, value: number): void {
        const [key, num, occur] = this.getComponents(at)
        this.set(key, num, occur, Number.isNaN(value) ? 0 : value)
    }

    increment(at: string, value: number): void {
        const [key, num, occur] = this.getComponents(at)
        this.set(key, num, occur, this.get(key, num, occur) + (Number.isNaN(value) ? 1 : value))
    }

    decrement(at: string, value: number): void {
        const [key, num, occur] = this.getComponents(at)
        this.set(key, num, occur, this.get(key, num, occur) - (Number.isNaN(value) ? 1 : value))
    }
}

const numStoreFilterTemplate = valueStoreTemplate(NumberStore)

export const incrementRecipe = <T extends {}>({
    tagname = 'inc',
    storeId = 'numerical',
    separator = { sep: ',' },
    assignmentSeparator = { sep: '=', trim: true },
} = {}) => (registrar: Registrar<T>) => registrar.register(
    tagname,
    numStoreFilterTemplate(
        storeId,
        0,
        (at, val) => (numberMap) => numberMap.increment(at, Number(val))
    ), {
        separators: [separator, assignmentSeparator],
    },
)

export const decrementRecipe = <T extends {}>({
    tagname = 'dec',
    storeId = 'numerical',
    separator = { sep: ',' },
    assignmentSeparator = { sep: '=', trim: true },
} = {}) => (registrar: Registrar<T>) => registrar.register(
    tagname,
    numStoreFilterTemplate(
        storeId,
        0,
        (at, val) => (numberMap) => numberMap.decrement(at, Number(val)),
    ), {
        separators: [separator, assignmentSeparator],
    }
)

export const setNumberRecipe = <T extends {}>({
    tagname = 'set',
    storeId = 'numerical',
    separator = { sep: ',' },
    assignmentSeparator = { sep: '=', trim: true },
} = {}) => (registrar: Registrar<T>) => registrar.register(
    tagname,
    numStoreFilterTemplate(
        storeId,
        0,
        (at, val) => (numberMap) => numberMap.setNumber(at, Number(val)),
    ), {
        separators: [separator, assignmentSeparator],
    },
)
