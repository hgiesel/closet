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

    get(value: string): T {
        const [key, num, occur] = this.getComponents(value)

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
}
