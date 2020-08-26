import type { Registrar } from '../types'

import {
    SharedStore,
    storeTemplate,
    defaultSeparator,
    defaultInnerSeparator
} from './storeTemplate'


class ListStore extends SharedStore<string[]> {
    setList(storeKey: string, list: string[]) {
        this.set(storeKey, list)
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
