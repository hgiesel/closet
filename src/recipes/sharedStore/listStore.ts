import type { Registrar, TagNode, Internals, Eval } from '../types'

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

const defaultPostprocess = <T extends Record<string, unknown>>(
    value: string,
    _valueList: string[],
): Eval<T, string> => (
    _tag: TagNode,
    _internals: Internals<T>,
): string => value

export const pickRecipe = <T extends Record<string, unknown>>({
    tagname = 'pick',
    storeId = 'lists',
    postprocess = defaultPostprocess,
} = {}) => (registrar: Registrar<T>) => registrar.register(
    tagname,
    listStoreTemplate(
        storeId,
        (tag, internals) => (listStore) => {
            const key = tag.values
            const valueList = listStore.getList(key)
            const pickedKey = `pick:${tag.fullKey}:${tag.occur}:${tagname}:picked`

            const index = internals.memory.lazy(pickedKey, () => {
                const ints = intAlgorithm(0, valueList.length)
                const stopper = intStop(0, valueList.length)

                // tag.num is used to decide uniqList
                const filter = Boolean(tag.num /* 0 is falsy */)
                const filterKey = `pick:${tag.fullKey}:${tagname}:uniqList:${tag.num}`

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
                    return index
                }
            })

            return postprocess(
                Number.isInteger(index)
                    ? valueList[index as number]
                    : '',
                valueList,
            )(tag, internals as any)
        },
    ),
)

export const pickIndexRecipe = <T extends Record<string, unknown>>({
    tagname = 'pick',
    storeId = 'lists',
    postprocess = defaultPostprocess,
} = {}) => (registrar: Registrar<T>) => registrar.register(
    tagname,
    listStoreTemplate(
        storeId,
        (tag, internals) => (listStore) => {
            const key = tag.values
            const valueList = listStore.getList(key)
            const numIndex = Number(tag.num ?? 0)

            return postprocess(valueList[numIndex] ?? '', valueList)(tag, internals as any)
        },
    ),
)
