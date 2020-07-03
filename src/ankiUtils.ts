import { interspliceChildNodes, ChildNodeSpan } from './browserUtils'

export const preset = (cardType: string, tagsFull: string, side: 'front' | 'back') => ({
    card: cardType,
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

export const memoryMap = (memoryKey: string): Map<string, unknown> => {
    const persistence = globalThis.Persistence as AnkiPersistence
    if (persistence && persistence.isAvailable()) {
        const maybeMap = persistence.getItem(memoryKey)

        if (maybeMap instanceof Map) {
            return maybeMap
        }
        else {
            const newMap = new Map()

            persistence.setItem(memoryKey, newMap)
            return newMap
        }
    }
    else {
        return new Map()
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
