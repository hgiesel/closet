import { TagData, Internals } from './types'

export const storeKeyPattern = /^([a-zA-Z0-9%\/]+?)([0-9]*|\*)$/u

export class ValueStore<T> {
    map: Map<string, T>
    defaultValue: T

    constructor(defaultValue: T) {
        this.defaultValue = defaultValue
        this.map = new Map()
    }

    protected getComponents(value: string): [string, string | null, string | null] {
        const [fullKey, occur] = value.split(':')
        const [, key, num] = fullKey.match(storeKeyPattern)

        const theNum = num.length === 0
            ? null
            : num

        const theOccur = occur
            ? occur
            : null

        return [key, theNum, theOccur]
    }


    protected getKey(key: string, num: string | null, occur: string | null): string {
        /**
         * empty string should never happen
         */

        const numString = num ?? '*'
        const occurString = occur ?? 'all'

        return `${key}${numString}:${occurString}`
    }

    get(key: string, num: string | null, occur: string | null): T {
        const firstKey = this.getKey(key, num, occur)
        if (this.map.has(firstKey)) {
            return this.map.get(firstKey)
        }

        const secondKey = this.getKey(key, num, null)
        if (this.map.has(secondKey)) {
            return this.map.get(secondKey)
        }

        const thirdKey = this.getKey(key, null, null)
        if (this.map.has(thirdKey)) {
            return this.map.get(thirdKey)
        }

        return this.defaultValue
    }

    set(key: string, num: string | null, occur: string | null, value: T): void {
        this.map.set(this.getKey(key, num, occur), value)
    }

    has(key: string, num: string | null, occur: string | null): void {
        this.map.has(this.getKey(key, num, occur))
    }
}

export const valueStoreTemplate = <T extends ValueStore<U>, U>(
    T: new (u: U) => T,
) => (
    storeId: string,
    defaultValue: U,
    operation: (val: string) => (a: T) => void,
) => (tag: TagData, { cache }: Internals<{}>) => {
    const commands = tag.values

    commands.forEach((cmd: string) => {
        const at = cmd
        cache.over(storeId, operation(at), new T(defaultValue))
    })

    return { ready: true }
}
