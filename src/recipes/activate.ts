import type { TagData, Registrar, Internals, DataOptions } from './types'
import { keyPattern } from './utils'

class ActivateMap {
    theMap: Map<string, boolean>

    constructor() {
        this.theMap = new Map()
    }

    private getKey(key: string, num: number | null, occur: number | null): string {
        const numString = typeof(num) === 'number'
            ? String(num)
            : 'all'

        const occurString = typeof(occur) === 'number'
            ? String(occur)
            : 'all'

        return `${key}:${numString}:${occurString}`
    }

    on(key: string, num: number | null, occur: number | null): void {
        const mapKey = this.getKey(key, num, occur)

        this.theMap.set(mapKey, true)
    }

    off(key: string, num: number | null, occur: number | null): void {
        const mapKey = this.getKey(key, num, occur)

        this.theMap.set(mapKey, false)
    }

    toggle(key: string, num: number | null, occur: number | null): void {
        const mapKey = this.getKey(key, num, occur)

        if (this.theMap.has(mapKey)) {
            this.theMap.set(mapKey, !this.theMap.get(mapKey))
        }
        else {
            this.theMap.set(mapKey, true)
        }
    }

    get(key: string, num: number | null, occur: number): boolean {
        const firstKey = this.getKey(key, num, occur)

        if (this.theMap.has(firstKey)) {
            return this.theMap.get(firstKey) ?? false
        }

        const secondKey = this.getKey(key, num, null)

        if (this.theMap.has(secondKey)) {
            return this.theMap.get(secondKey) ?? false
        }

        const thirdKey = this.getKey(key, null, null)

        if (this.theMap.has(thirdKey)) {
            return this.theMap.get(thirdKey) ?? false
        }

        return false
    }
}

const activateFilterTemplate = (
    activateId: string,
    operation: (key: string, occur: number | null, num: number | null) => (a: ActivateMap) => void,
) => (tag: TagData, { cache }: Internals<{}>) => {
    const commands = tag.values

    commands.forEach((val: string) => {
        const [fullKey, occur] = val.split(':')
        const [, key, num] = fullKey.match(keyPattern)

        const theOccur = occur
            ? Number(occur)
            : null

        const theNum = num.length === 0
            ? null
            : Number(num)

        cache.over(`${key}:${activateId}`, operation(key, theNum, theOccur), new ActivateMap())
    })

    return ''
}

const activateDataOptions: Partial<DataOptions> = { separators: [','] }

export const activateRecipe = ({
    tagname = 'on',
    activateId = 'activate',
} = {}) => (registrar: Registrar<{}>) => {
    registrar.register(tagname, activateFilterTemplate(
        activateId,
        (key, num, occur) => (activateMap) => {
            activateMap.on(key, num, occur)
        }
    ), activateDataOptions)
}

export const deactivateRecipe = ({
    tagname = 'off',
    activateId = 'activate',
} = {}) => (registrar: Registrar<{}>) => {
    registrar.register(tagname, activateFilterTemplate(
        activateId,
        (key, num, occur) => (activateMap) => {
            activateMap.off(key, num, occur)
        }
    ), activateDataOptions)
}

export const toggleRecipe = ({
    tagname = 'toggle',
    activateId = 'activate',
} = {}) => (registrar: Registrar<{}>) => {
    registrar.register(tagname, activateFilterTemplate(
        activateId,
        (key, num, occur) => (activateMap) => {
            activateMap.toggle(key, num, occur)
        }
    ), activateDataOptions)
}
