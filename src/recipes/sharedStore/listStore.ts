import type { Registrar } from '../types'

import {
    SharedStore,
    storeTemplate,
    defaultSeparator,
    defaultInnerSeparator
} from './storeTemplate'


class ListStore extends SharedStore<string[]> {
    setList(storeKey: string, list: string[]): void {
        this.set(storeKey, list)
    }

    getList(storeKey: string): string[] {
        return this.get(storeKey, [])
    }
}

const listStoreTemplate = storeTemplate(ListStore)

export const setListRecipe = <T extends {}>({
    tagname = 'setl',
    storeId = 'lists',
    separator = defaultSeparator,
    innerSeparator = defaultInnerSeparator,
} = {}) => (registrar: Registrar<T>) => registrar.register(
    tagname,
    listStoreTemplate(
        storeId,
        (key, vals) => (listStore) => listStore.setList(key[0], vals),
    ), {
        separators: [separator, innerSeparator],
    },
)

export const pickRecipe = <T extends {}>({
    tagname = 'pick',
    storeId = 'lists',
    separator = defaultSeparator,
    innerSeparator = defaultInnerSeparator,
} = {}) => (registrar: Registrar<T>) => registrar.register(
    tagname,
    listStoreTemplate(
        storeId,
        (key, vals, uniq) => (listStore) => {
            const valueList = listStore.getList(key[0])
            const amount = Number(vals[0]) ?? 1

            return valueList[0]
        },
    ), {
        separators: [separator, innerSeparator],
    },
)
