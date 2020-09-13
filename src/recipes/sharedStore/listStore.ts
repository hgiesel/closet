import type { Registrar } from '../types'
import { Stylizer } from '../stylizer'

import {
    SharedStore,
    storeTemplate,
} from './storeTemplate'

import {
    numberGenerator,
    intAlgorithm,
    intStop,
} from '../generator'


class ListStore extends SharedStore<string[]> {
    setList(storeKey: string, list: string[]): void {
        this.set(storeKey, list)
    }

    getList(storeKey: string): string[] {
        return this.get(storeKey, [])
    }
}

const listStoreTemplate = storeTemplate(ListStore)

export const setListRecipe = <T extends Record<string, unknown>>({
    tagname = 'setl',
    storeId = 'lists',
    separator = { sep: '::' },
    innerSeparator = { sep: '||' },
} = {}) => (registrar: Registrar<T>) => registrar.register(
    tagname,
    listStoreTemplate(
        storeId,
        (tag) => (listStore) => {
            const [
                key,
                values,
            ] = tag.values

            listStore.setList(key[0], values)
        },
    ), {
        separators: [separator, innerSeparator],
    },
)

export const pickRecipe = <T extends Record<string, unknown>>({
    tagname = 'pick',
    storeId = 'lists',
    stylizer = Stylizer.make(),
    separator = { sep: ';' },
    innerSeparator = { sep: ',' },
} = {}) => (registrar: Registrar<T>) => registrar.register(
    tagname,
    listStoreTemplate(
        storeId,
        (tag, internals) => (listStore) => {
            const result = []

            for (const [key, options = '1', uniq = ''] of tag.values) {
                const valueList = listStore.getList(key)
                const pickedKey = `pick:${tag.fullKey}:${tag.occur}:${tagname}:picked`

                const indices = internals.memory.lazy(pickedKey, () => {
                    const indices = []

                    const amount = Number(options)

                    const ints = intAlgorithm(0, valueList.length)
                    const stopper = intStop(0, valueList.length)

                    const filter = Boolean(uniq)
                    const filterKey = `pick:${tag.fullKey}:${tagname}:uniqList:${uniq}`

                    const uniqList: number[] = filter
                        ? internals.memory.over(
                            filterKey,
                            (uniqHash: Record<string, number[]>): Record<string, number[]> => {
                                if (!Object.prototype.hasOwnProperty.call(uniqHash, key)) {
                                    uniqHash[key] = []
                                }

                                return uniqHash
                            },
                            {},
                        )[key]
                        : []

                    const generator = numberGenerator(
                        ints,
                        filter,
                        uniqList,
                        stopper,
                    )

                    for (const index of generator) {
                        indices.push(index)

                        if (indices.length >= amount) {
                            break
                        }
                    }

                    return indices
                })

                for (const index of indices) {
                    result.push(valueList[index])
                }
            }

            return stylizer.stylize(result)
        },
    ), {
        separators: [separator, innerSeparator],
    },
)

export const pickIndexRecipe = <T extends Record<string, unknown>>({
    tagname = 'pick',
    storeId = 'lists',
    stylizer = Stylizer.make(),
    separator = { sep: ';' /* same as separtor for pick */ },
    innerSeparator = { sep: ':', trim: true },
} = {}) => (registrar: Registrar<T>) => registrar.register(
    tagname,
    listStoreTemplate(
        storeId,
        (tag, _internals) => (listStore) => {
            const result = []

            for (const [storeKey, numIndexString = '0'] of tag.values) {
                const valueList = listStore.getList(storeKey)
                const numIndex = Number(numIndexString)

                if (Number.isNaN(numIndex)) {
                    continue
                }

                result.push(valueList[numIndex])
            }

            return stylizer.stylize(result)
        },
    ), {
        separators: [separator, innerSeparator],
    },
)
