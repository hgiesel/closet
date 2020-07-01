import type { TagData, Registrar, Internals } from './types'

import { ValueStore } from './valueStore'

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

const activateFilterTemplate = (
    activateId: string,
    operation: (val: string) => (a: BoolStore) => void,
) => (tag: TagData, { cache }: Internals<{}>) => {
    const commands = tag.values

    commands.forEach((at: string) => {
        cache.over(`${activateId}`, operation(at), new BoolStore(false))
    })

    return { ready: true }
}

export const activateRecipe = ({
    tagname = 'on',
    activateId = 'activate',
    separator = { sep: ',' },
} = {}) => (registrar: Registrar<{}>) => {
    registrar.register(tagname, activateFilterTemplate(
        activateId,
        (val) => (activateMap) => {
            activateMap.on(val)
        }
    ), { separators: [separator] })
}

export const deactivateRecipe = ({
    tagname = 'off',
    activateId = 'activate',
    separator = { sep: ',' },
} = {}) => (registrar: Registrar<{}>) => {
    registrar.register(tagname, activateFilterTemplate(
        activateId,
        (val) => (activateMap) => {
            activateMap.off(val)
        }
    ), { separators: [separator] })
}

export const toggleRecipe = ({
    tagname = 'toggle',
    activateId = 'activate',
    separator = { sep: ',' },
} = {}) => (registrar: Registrar<{}>) => {
    registrar.register(tagname, activateFilterTemplate(
        activateId,
        (val) => (activateMap) => {
            activateMap.toggle(val)
        }
    ), { separators: [separator] })
}
