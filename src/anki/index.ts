import type { JSON } from './persistence'
import type { FilterManager } from '..'

import { interspliceChildNodes, BrowserTemplate, ChildNodeSpan } from '../browser'
import { persistence } from './persistence'


interface ClosetSideHash {
    closetCardHash: number
}

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

interface MemoryMap {
    key: string,
    map: Map<string, unknown>
    writeBack: () => void
}

const hashCode = (plain: string): number => {
    let hash = 0, i, chr
    for (i = 0; i < plain.length; i++) {
        chr = plain.charCodeAt(i)
        hash = ((hash << 5) - hash) + chr
        hash |= 0 // Convert to 32bit integer
    }
    return hash
}

const persistenceInterface = (side: 'front' | 'back', label: string) => (memoryKey: string): MemoryMap => {
    /**
     * @param label: should identify the context where persistence is used
     */

    const currentHash = (globalThis as typeof globalThis & Partial<ClosetSideHash>).closetCardHash ?? null

    const getPersistentMap = (): Map<string, unknown> => {
        if (!persistence.isAvailable()) {
            // Persistence is not available, fallback to no memory
            return new Map()
        }

        if (side === 'front') {
            const hash = hashCode(label)

            if (hash !== currentHash) {
                // This is a new displayed card, reset memory
                (globalThis as typeof globalThis & Partial<ClosetSideHash>).closetCardHash = hash
                return new Map()
            }
        }

        const maybeMap = persistence.getItem(memoryKey) as Iterable<readonly [string, unknown]>
        return new Map(maybeMap)
    }

    const map = getPersistentMap()

    const setPersistentMap = (): void => {
        if (persistence.isAvailable()) {
            const persistentData = Array.from(map.entries())

            persistence.setItem(memoryKey, persistentData as JSON)
        }
    }

    const mmap = {
        key: memoryKey,
        map: map,
        writeBack: setPersistentMap,
    }

    return mmap
}

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


type SetupOutput<T extends Record<string, unknown>> = [
    Element[],
    MemoryMap,
    FilterManager<T>,
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
): number => {
    const before = window.performance.now()
    BrowserTemplate
        .makeFromNodes(elements)
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
