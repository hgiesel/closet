import { interspliceChildNodes, ChildNodeSpan } from './browserTemplate'

export const getCardNumber = (textNum: string): number => Number(textNum.match(/[0-9]*$/))

export const preset = (cardType: string, tagsFull: string, side: 'front' | 'back') => ({
    card: cardType,
    cardNumber: getCardNumber(cardType),
    tagsFull: tagsFull,
    tags: tagsFull.length === 0
        ? []
        : tagsFull.split(' '),
    side: side,
})

// https://github.com/SimonLammer/anki-persistence#usage
interface AnkiPersistence {
    clear: () => void
    getItem(key: string): unknown
    getItem(): unknown
    setItem(key: string, value: unknown): void
    setItem(value: unknown): void
    removeItem(key: string): void
    removeItem(): void
    isAvailable(): boolean
}

interface MemoryMap {
    map: Map<string, unknown>
    writeBack: () => void
}

const getPersistentMap = (persistence: AnkiPersistence, memoryKey: string): Map<string, unknown> => {
    if (persistence && persistence.isAvailable()) {
        const maybeMap = persistence.getItem(memoryKey) as Iterable<readonly [string, unknown]>
        return new Map(maybeMap)
    }

    return new Map()
}

const setPersistentMap = (persistence: AnkiPersistence, memoryKey: string, value: Map<string, unknown>): void => {
    if (persistence && persistence.isAvailable()) {
        const persistentData = Array.from(value.entries())
        persistence.setItem(memoryKey, persistentData)
    }
}

export const memoryMap = (memoryKey: string): MemoryMap => {
    const persistence = globalThis.Persistence as AnkiPersistence
    const map = getPersistentMap(persistence, memoryKey)

    return {
        map: map,
        writeBack: (): void => {
            setPersistentMap(persistence, memoryKey, map)
        },
    }
}

export const getQaChildNodes = (): ChildNodeSpan[] | null => {
    if (!globalThis.document) {
        return null
    }

    const qa = globalThis.document.getElementById('qa')

    if (!qa) {
        return null
    }


    return interspliceChildNodes(qa, {
        type: 'predicate',
        value: (v: any) => (
            v.tagName !== 'STYLE' && v.tagName !== 'SCRIPT' && v.id !== 'anki-am'
        )
    })
}
