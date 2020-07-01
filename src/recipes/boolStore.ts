import type { Registrar } from './types'

import { ValueStore, valueStoreTemplate } from './valueStore'

class BoolStore extends ValueStore<boolean> {
    on(value: string): void {
        const mapKey = this.getKey(...this.getComponents(value))

        this.map.set(mapKey, true)
    }

    off(value: string): void {
        const mapKey = this.getKey(...this.getComponents(value))

        this.map.set(mapKey, false)
    }

    toggle(value: string): void {
        const mapKey = this.getKey(...this.getComponents(value))

        if (this.map.has(mapKey)) {
            this.map.set(mapKey, !this.map.get(mapKey))
        }
        else {
            this.map.set(mapKey, !this.defaultValue)
        }
    }
}

const numStoreFilterTemplate = valueStoreTemplate(BoolStore)

export const activateRecipe = ({
    tagname = 'on',
    activateId = 'active',
    separator = { sep: ',' },
} = {}) => (registrar: Registrar<{}>) => {
    registrar.register(tagname, numStoreFilterTemplate(
        activateId,
        false,
        (val) => (activateMap) => {
            activateMap.on(val)
        }
    ), { separators: [separator] })
}

export const deactivateRecipe = ({
    tagname = 'off',
    activateId = 'active',
    separator = { sep: ',' },
} = {}) => (registrar: Registrar<{}>) => {
    registrar.register(tagname, numStoreFilterTemplate(
        activateId,
        false,
        (val) => (activateMap) => {
            activateMap.off(val)
        }
    ), { separators: [separator] })
}

export const toggleRecipe = ({
    tagname = 'toggle',
    activateId = 'active',
    separator = { sep: ',' },
} = {}) => (registrar: Registrar<{}>) => {
    registrar.register(tagname, numStoreFilterTemplate(
        activateId,
        false,
        (val) => (activateMap) => {
            activateMap.toggle(val)
        }
    ), { separators: [separator] })
}
