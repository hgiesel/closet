import type { Registrar, TagNode, Internals, Eval } from '../types'
import type { CardPreset } from '../flashcard/flashcardTemplate'

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

    overwriteList(storeKey: string, newList: string[], fromIndex: number = 0): void {
        const list = this.getList(storeKey)

        for (let i = 0; i < newList.length; i++) {
            list[fromIndex + i] = newList[i]
        }

        this.setList(storeKey, list)
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
            ] = tag.values.length === 2
                ? tag.values
                : [['default'], tag.values[0]]

            const theKey = key[0]

            if (tag.num === null) {
                listStore.setList(theKey, values)
            }
            else {
                listStore.overwriteList(theKey, values, tag.num)
            }
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
            const key = tag.values || /* in case it is '' */ 'default'

            const valueList = listStore.getList(key)
            const pickedKey = `pick:${tag.fullKey}:${tag.occur}:${tagname}:picked`

            const index = internals.memory.lazy(pickedKey, () => {
                const algorithm = intAlgorithm(0, valueList.length)
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

                const emptyIndices = Array.from(valueList)
                    .reduce((accu: number[], value: string | undefined, index: number): number[] => {
                        if (value === undefined) {
                            accu.push(index)
                        }

                        return accu
                    }, [])

                const banList = uniqList.concat(emptyIndices)

                const generator = numberGenerator(
                    algorithm,
                    filter,
                    banList,
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

const pickIndex = <T extends Record<string, unknown>>(
    getValue: (valueList: string[]) => Eval<T, string>,
    postprocess: (value: string, valueList: string[]) => Eval<T, string>,
) => (
    tag: TagNode,
    internals: Internals<T>,
) => (
    listStore: ListStore
): string => {
    const key = tag.values || /* in case it is '' */ 'default'

    const valueList = listStore.getList(key)
    const value = getValue(valueList)(tag, internals)

    return postprocess(value, valueList)(tag, internals as any)
}

export const pickIndexRecipe = <T extends Record<string, unknown>>({
    tagname = 'pick',
    storeId = 'lists',
    postprocess = defaultPostprocess,
} = {}) => (registrar: Registrar<T>) => registrar.register(
    tagname,
    listStoreTemplate(
        storeId,
        pickIndex(
            (list: string[]) => (tag: TagNode, _internals: Internals<T>): string => list[Number(tag.num) || 0],
            postprocess,
        ) as any,
    ),
)

export const pickCardNumber = <T extends CardPreset>({
    tagname = 'pick',
    storeId = 'lists',
    postprocess = defaultPostprocess,
} = {}) => (registrar: Registrar<T>) => registrar.register(
    tagname,
    listStoreTemplate(
        storeId,
        pickIndex(
            (list: string[]) => (_tag: TagNode, internals: Internals<T>): string => {
                const indexedValue: string | undefined = list[internals.preset.cardNumber as number]
                const result: string = indexedValue ?? list[0] ?? ''

                return result
            },
            postprocess,
        ) as any,
    ),
)
