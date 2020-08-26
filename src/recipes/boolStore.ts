import type { Registrar } from './types'

import {
    ValueStore,
    valueStoreTemplate,
    defaultSeparator,
    innerSeparator
} from './valueStore'

class BoolStore extends ValueStore<boolean> {
    on(selector: string): void {
        this.set(selector, true)
    }

    off(selector: string): void {
        this.set(selector, false)
    }
}

const boolStoreFilterTemplate = valueStoreTemplate(BoolStore)


export const activateRecipe = ({
    tagname = 'on',
    storeId = 'active',
    separator = defaultSeparator,
} = {}) => (registrar: Registrar<{}>) => registrar.register(
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

export const deactivateRecipe = <T extends {}>({
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
