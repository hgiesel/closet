import type { Registrar } from '../types'

import {
    SharedStore,
    storeTemplate,
    defaultSeparator,
    innerSeparator
} from './storeTemplate'


class ListStore extends SharedStore<string[]> {
    setList<T extends string[]>(storeKey: string, list: T) {
        this.set(storeKey, list)
    }
}

const listStoreTemplate = storeTemplate(ListStore as any)

export const setListRecipe = <T extends {}>({
    tagname = 'setl',
    storeId = 'lists',
    separator = defaultSeparator,
    assignmentSeparator = innerSeparator,
} = {}) => (registrar: Registrar<T>) => registrar.register(
    tagname,
    listStoreTemplate(
        storeId,
        (key, vals) => (listStore) => (listStore as any).setList(key[0], vals),
    ), {
        separators: [separator, assignmentSeparator],
    },
)
