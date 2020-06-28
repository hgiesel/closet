import type { StorageType } from './filterManager/storage'
import { interspliceChildNodes, ChildNodeSpan } from './browserUtils'

const cardType = '{{Card}}'
const tagsFull = '{{Tags}}'
const tags = tagsFull.length === 0
    ? []
    : tagsFull.split(' ')

export const preset = (side: 'front' | 'back') => ({
    card: cardType,
    tagsFull: tagsFull,
    tags: tags,
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
}

interface MemorySwitcher extends StorageType {
    switchTo: (i: string) => void
}

export const memorySwitch = (p: AnkiPersistence): MemorySwitcher => {
    let path: Map<string, unknown> = new Map<string, unknown>()

    return {
        switchTo: (i: string) => {
            if (p.getItem(i)) {
                path = p.getItem(i) as Map<string, unknown>
            }
            else {
                p.setItem(i, new Map())
                path = p.getItem(i) as Map<string, unknown>
            }
        },
        has: (k: string): boolean => path.has(k),
        get: <T>(k: string): T => path.get(k) as T,
        set: (k: string, v: unknown): void => { path.set(k, v) },
        delete: (k: string): void => { path.delete(k) },
        clear: (): void => path.clear(),
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
