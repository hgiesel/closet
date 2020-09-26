import { interspliceChildNodes, ChildNodeSpan } from '../browser'


// https://github.com/SimonLammer/anki-persistence#usage
export interface AnkiPersistence {
    clear: () => void
    getItem(key: string): unknown
    getItem(): unknown
    setItem(key: string, value: unknown): void
    setItem(value: unknown): void
    removeItem(key: string): void
    removeItem(): void
    isAvailable(): boolean
}

interface ClosetPersistence {
    Persistence: AnkiPersistence
}

const getCardNumber = (textNum: string): number => Number(textNum.match(/[0-9]*$/))

export const preset = (cardType: string, tagsFull: string, side: 'front' | 'back') => ({
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

const usesSessionStorage = (): boolean => {
    // this detects whether Anki Persistence uses the sessionStorage implementation
    // this definition is mostly from Anki Persistence source code
    try {
        if (typeof globalThis.sessionStorage === 'object') {
            return true
        }
    }
    catch {
        return false
    }

    // should never get here
    return false
}

export const persistenceInterface = (side: 'front' | 'back') => (memoryKey: string): MemoryMap => {
    const persistence = (globalThis as typeof globalThis & Partial<ClosetPersistence>).Persistence ?? null

    const getPersistentMap = (): Map<string, unknown> => {
        if (
            persistence &&
            persistence.isAvailable() &&
            (side === 'back' || !usesSessionStorage())
        ) {
            const maybeMap = persistence.getItem(memoryKey) as Iterable<readonly [string, unknown]> 
            return new Map(maybeMap)
        }

        return new Map()
    }

    const map = getPersistentMap()

    const setPersistentMap = (): void => {
        if (
            persistence &&
            persistence.isAvailable()
        ) {
            const persistentData = Array.from(map.entries())

            persistence.setItem(memoryKey, persistentData)
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
            v.id !== 'anki-am' /* anki asset manager support */
        )
    })
}
