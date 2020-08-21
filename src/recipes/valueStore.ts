import { TagData, Internals } from './types'

export type StoreGetter<T> = { get: (key: string, num: number | null, occur: number) => T }

export const storeKeyPattern = /^([a-zA-Z0-9%\/]*?)([0-9]*|\*)$/u
export const constantGet = <T>(v: T): StoreGetter<T> => ({ get: () => v })

export class ValueStore<T> {
    map: Map<string, T>
    defaultValue: T

    static all = Symbol()

    constructor(defaultValue: T) {
        this.defaultValue = defaultValue
        this.map = new Map()
    }

    protected getComponents(value: string): [string | symbol, number | symbol | null, number | symbol] {
        /**
         * turns a store key into its components
         */

        const [fullKey, occur] = value.split(':')
        const [, key, num] = fullKey.match(storeKeyPattern)

        const theKey = key === ''
            ? ValueStore.all
            : key

        const theNum = num === '*'
            ? ValueStore.all
            : num.length === 0
            ? null
            : Number(num)

        const theOccur = occur
            ? Number(occur)
            : ValueStore.all

        return [theKey, theNum, theOccur]
    }


    protected getStoreKey(key: string | symbol, num: number | null | symbol, occur: number | symbol): string {
        /**
         * turns components into a fully qualified store key
         */

        const keyString: string = key === ValueStore.all ? '' : String(key)

        const numString: string = num === ValueStore.all
            ? '*'
            : num === null
            ? ''
            : String(num)

        const occurString: string = occur === ValueStore.all
            ? 'all'
            : String(occur) 

        return `${keyString}${numString}:${occurString}`
    }

    get(key: string | symbol, num: number | null | symbol, occur: number | symbol): T {
        const firstKey = this.getStoreKey(key, num, occur)
        if (this.map.has(firstKey)) {
            return this.map.get(firstKey) ?? this.defaultValue
        }

        const secondKey = this.getStoreKey(key, num, ValueStore.all)
        if (this.map.has(secondKey)) {
            return this.map.get(secondKey) ?? this.defaultValue
        }

        const thirdKey = this.getStoreKey(key, ValueStore.all, ValueStore.all)
        return this.map.get(thirdKey) ?? this.defaultValue
    }

    set(key: string | symbol, num: number | null | symbol, occur: number | symbol, value: T): void {
        this.map.set(this.getStoreKey(key, num, occur), value)
    }

    has(key: string | symbol, num: number | null | symbol, occur: number | symbol): void {
        this.map.has(this.getStoreKey(key, num, occur))
    }
}

export const valueStoreTemplate = <T extends ValueStore<U>, U>(
    T: new (u: U) => T,
) => (
    storeId: string,
    defaultValue: U,
    operation: (...vals: string[]) => (a: T) => void,
) => <TT extends {}>(tag: TagData, { cache }: Internals<TT>) => {
    const commands = tag.values

    commands.forEach((cmd: string) => {
        cache.over(storeId, operation(...cmd), new T(defaultValue))
    })

    return { ready: true }
}
