import type { Registrar } from './types'

import { ValueStore, valueStoreTemplate } from './valueStore'

class BoolStore extends ValueStore<boolean> {
    on(at: string): void {
        const [key, num, occur] = this.getComponents(at)
        this.set(key, num, occur, true)
    }

    off(at: string): void {
        const [key, num, occur] = this.getComponents(at)
        this.set(key, num, occur, false)
    }

    toggle(at: string): void {
        const [key, num, occur] = this.getComponents(at)
        this.set(key, num, occur, !this.get(key, num, occur))
    }
}

const boolStoreFilterTemplate = valueStoreTemplate(BoolStore)

export const activateRecipe = ({
    tagname = 'on',
    storeId = 'active',
    separator = { sep: ',' },
} = {}) => (registrar: Registrar<{}>) => {
    registrar.register(tagname, boolStoreFilterTemplate(
        storeId,
        false,
        (val) => (activateMap) => {
            activateMap.on(val)
        }
    ), { separators: [separator] })
}

export const deactivateRecipe = ({
    tagname = 'off',
    storeId = 'active',
    separator = { sep: ',' },
} = {}) => (registrar: Registrar<{}>) => {
    registrar.register(tagname, boolStoreFilterTemplate(
        storeId,
        false,
        (val) => (activateMap) => {
            activateMap.off(val)
        }
    ), { separators: [separator] })
}

export const toggleRecipe = ({
    tagname = 'toggle',
    storeId = 'active',
    separator = { sep: ',' },
} = {}) => (registrar: Registrar<{}>) => {
    registrar.register(tagname, boolStoreFilterTemplate(
        storeId,
        false,
        (val) => (activateMap) => {
            activateMap.toggle(val)
        }
    ), { separators: [separator] })
}
