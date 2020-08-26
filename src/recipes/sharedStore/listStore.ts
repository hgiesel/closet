import type { Registrar } from '../types'
import { Stylizer } from '../stylizer'

import {
    SharedStore,
    storeTemplate,
    defaultSeparator,
    defaultInnerSeparator
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

export const setListRecipe = <T extends {}>({
    tagname = 'setl',
    storeId = 'lists',
    separator = defaultSeparator,
    innerSeparator = defaultInnerSeparator,
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

const pickSeparator = { 'sep': '::' }

export const pickRecipe = <T extends {}>({
    tagname = 'pick',
    storeId = 'lists',
    stylizer = Stylizer.make(),
    separator = pickSeparator,
    innerSeparator = defaultInnerSeparator,
} = {}) => (registrar: Registrar<T>) => registrar.register(
    tagname,
    listStoreTemplate(
        storeId,
        (tag, internals) => (listStore) => {
            const result = []

            const [
                key,
                options,
                uniq,
            ] = tag.values

            const valueList = listStore.getList(key[0])

            const pickedKey = `pick:${tag.fullKey}:${tag.occur}:${tagname}:picked`

            const indices = internals.memory.lazy(pickedKey, () => {
                const indices = []

                const amount = Number(options[0]) ?? 1

                const ints = intAlgorithm(0, valueList.length)
                const stopper = intStop(0, valueList.length)
                const filter = Boolean(uniq)

                const generator = numberGenerator(ints, filter, [], stopper)

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

            return stylizer.stylize(result)
        },
    ), {
        separators: [separator, innerSeparator],
    },
)
