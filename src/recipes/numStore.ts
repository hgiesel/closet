import type { Registrar } from './types'

import { ValueStore, valueStoreTemplate } from './valueStore'

class NumStore extends ValueStore<number> {
    setNumber(at: string, value = 0): void {
        const [key, num, occur] = this.getComponents(at)
        this.set(key, num, occur, value)
    }

    increment(at: string, value = 1): void {
        const [key, num, occur] = this.getComponents(at)
        this.set(key, num, occur, this.get(key, num, occur) + value)
    }

    decrement(at: string, value = 1): void {
        const [key, num, occur] = this.getComponents(at)
        this.set(key, num, occur, this.get(key, num, occur) - value)
    }
}

const numStoreFilterTemplate = valueStoreTemplate(NumStore)

export const incrementRecipe = ({
    tagname = 'inc',
    storeId = 'numerical',
    separator = { sep: ',' },
    assignmentSeparator = { sep: '=', trim: true },
} = {}) => (registrar: Registrar<{}>) => {
    registrar.register(tagname, numStoreFilterTemplate(
        storeId,
        0,
        (val) => (numberMap) => {
            numberMap.increment(val)
        }
    ), { separators: [separator, assignmentSeparator] })
}

export const decrementRecipe = ({
    tagname = 'dec',
    storeId = 'numerical',
    separator = { sep: ',' },
    assignmentSeparator = { sep: '=', trim: true },
} = {}) => (registrar: Registrar<{}>) => {
    registrar.register(tagname, numStoreFilterTemplate(
        storeId,
        0,
        (val) => (numberMap) => {
            numberMap.decrement(val)
        }
    ), { separators: [separator, assignmentSeparator] })
}

export const setNumberRecipe = ({
    tagname = 'set',
    storeId = 'numerical',
    separator = { sep: ',' },
    assignmentSeparator = { sep: '=', trim: true },
} = {}) => (registrar: Registrar<{}>) => {
    registrar.register(tagname, numStoreFilterTemplate(
        storeId,
        0,
        (val) => (numberMap) => {
            numberMap.setNumber(val)
        }
    ), { separators: [separator, assignmentSeparator] })
}
