import type { ASTNode } from '../nodes'

import { TagNode } from '../nodes'


/**
 * works with keys, but also with tag identifier
 */
export const keySeparationPattern = /^((?:[a-zA-Z_/]|%\w)+)(\d*)(?::(\d+))?$/u

const getAndInc = (map: Map<string, number>, key: string): number => {
    const result = (map.get(key) ?? -1) + 1

    map.set(key, result)
    return result
}

export type TagBuilderSettings = [Map<string, number>, Map<string, number>]

class TagBuilder {
    protected tagCounter: Map<string, number> | null = null
    protected tagCounterFull: Map<string, number> | null = null

    protected increment(fullKey: string, key: string): [number, number] {
        return [
            getAndInc(this.tagCounterFull as Map<string, number>, fullKey),
            getAndInc(this.tagCounter as Map<string, number>, key),
        ]
    }

    build(fullKey: string, innerNodes: ASTNode[]): TagNode {
        const match = fullKey.match(keySeparationPattern)

        if (!match) {
            throw new Error('Could not match key. This should never happen.')
        }

        const key = match[1]
        const num = match[2].length > 0 ? Number(match[2]) : null

        const [
            fullOccur,
            occur,
        ] = this.increment(fullKey, key)

        return new TagNode(fullKey, key, num, fullOccur, occur, innerNodes)
    }

    push(settings: TagBuilderSettings): void {
        this.tagCounterFull = settings[0]
        this.tagCounter = settings[1]
    }
}

// singleton
export const tagBuilder = new TagBuilder()
