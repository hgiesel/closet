import type { Registrar } from '../../types'

import {
    PreferenceStore,
    storeTemplate,
    defaultSeparator,
    innerSeparator
} from './storeTemplate'


class BoolStore extends PreferenceStore<boolean> {
    on(selector: string): void {
        this.set(selector, true)
    }

    off(selector: string): void {
        this.set(selector, false)
    }
}

const boolStoreFilterTemplate = storeTemplate(BoolStore)

export const activateRecipe = ({
    tagname = 'on',
    storeId = 'active',
    separator = defaultSeparator,
} = {}) => (registrar: Registrar<Record<string, unknown>>) => registrar.register(
    tagname,
    boolStoreFilterTemplate(
        storeId,
        false,
        (selector) => (activateMap) => {
            activateMap.on(selector)
        }
    ), {
        separators: [separator, innerSeparator],
    },
)

export const deactivateRecipe = <T extends Record<string, unknown>>({
    tagname = 'off',
    storeId = 'active',
    separator = defaultSeparator,
} = {}) => (registrar: Registrar<T>) => registrar.register(
    tagname,
    boolStoreFilterTemplate(
        storeId,
        false,
        (selector) => (activateMap) => activateMap.off(selector)
    ), {
        separators: [separator, innerSeparator],
    }
)
