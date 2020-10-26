import type { MemoryMap } from './persistence'
import type { FilterManager } from '..'
import type { Delimiters } from '../template/parser/tokenizer/delimiters'

import { interspliceChildNodes, BrowserTemplate, ChildNodeSpan } from '../browser'
import { persistenceInterface } from './persistence'


type CardSide = 'front' | 'back'

const getCardNumber = (textNum: string): number => Number(textNum.match(/[0-9]*$/))

const preset = (cardType: string, tagsFull: string, side: CardSide) => ({
    card: cardType,
    cardNumber: getCardNumber(cardType),
    tagsFull: tagsFull,
    tags: tagsFull.length === 0
        ? []
        : tagsFull.split(' '),
    side: side,
})


export const getQaChildNodes = (): ChildNodeSpan[] | null => {
    if (!window.document) {
        return null
    }

    const qa = window.document.getElementById('qa')

    if (!qa) {
        return null
    }

    return interspliceChildNodes(qa, {
        type: 'predicate',
        value: (v: any) => (
            v.tagName !== 'STYLE' &&
            v.tagName !== 'SCRIPT' &&
            v.id !== 'anki-am' /* Asset Manager support */
        )
    })
}

interface SetupOptions {
    delimiters: Delimiters,
}

type SetupOutput<T extends Record<string, unknown>> = [
    Element[],
    MemoryMap,
    FilterManager<T>,
    SetupOptions?,
]

type UserLogic<T extends Record<string, unknown>> = (
    closet: unknown,
    preset: unknown,
    chooseMemory: unknown,
) => SetupOutput<T>[]

const load = <T extends Record<string, unknown>>(
    elements: Element[],
    memoryMap: MemoryMap,
    filterManager: FilterManager<T>,
    options?: SetupOptions,
): number => {
    const before = window.performance.now()
    BrowserTemplate
        .makeFromNodes(elements, options?.delimiters)
        .renderToNodes(filterManager)

    memoryMap.writeBack()
    const after = window.performance.now()

    return after - before
}

export const init = <T extends Record<string, unknown>>(
    closet: unknown,
    logic: UserLogic<T>,
    cardType: string,
    tagsFull: string,
    side: CardSide,
): number[] => {
    const userPreset = preset(cardType, tagsFull, side)
    const chooseMemory = persistenceInterface(side, document.getElementById('qa')?.innerHTML ?? '')

    return logic(closet, userPreset, chooseMemory)
        .map((value: SetupOutput<T>) => load(...value))
}
