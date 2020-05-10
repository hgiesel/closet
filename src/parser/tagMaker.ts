import { Tag } from '../tags'

const keyPattern = /^([^0-9]+)([0-9]*)$/u

class TagMaker {
    private readonly tagCounter: Map<string, number>

    constructor() {
        this.tagCounter = new Map()
    }

    private getAndInc(key: string): number {
        const result = this.tagCounter.has(key)
            ? this.tagCounter.get(key) + 1
            : 0

        this.tagCounter.set(key, result)
        return result
    }

    makeTag(fullKey: string, valuesRaw: string | null, path: number[]): Tag {
        const match = fullKey.match(keyPattern)

        const key = match[1]
        const idx = match[2].length === 0 ? null : Number(match[2])

        const fullOccur = this.getAndInc(fullKey)
        const occur = fullKey === key
            ? fullOccur
            : this.getAndInc(key)

        return new Tag(
            fullKey,
            key,
            idx,
            valuesRaw,
            fullOccur,
            occur,
            path,
        )
    }
}

export default TagMaker
