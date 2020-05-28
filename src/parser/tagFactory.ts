import { Tag, TagInfo } from '../tags'

const keyPattern = /^([^0-9]+)([0-9]*)$/u

export class TagFactory {
    private readonly tagCounter: Map<string, number>

    private readonly tagPathStack: number[]
    private tagPathNext: number

    constructor() {
        this.tagCounter = new Map()
        this.tagPathStack = []
        this.tagPathNext = 0
    }

    private getAndInc(key: string): number {
        const result = this.tagCounter.has(key)
            ? this.tagCounter.get(key) + 1
            : 0

        this.tagCounter.set(key, result)
        return result
    }

    signalTagOpen(): void {
        this.tagPathStack.push(this.tagPathNext)
        this.tagPathNext = 0
    }

    build(fullKey: string, valuesRaw: string | null): Tag {
        const match = fullKey.match(keyPattern)

        const key = match[1]
        const idx = match[2].length === 0 ? null : Number(match[2])

        const fullOccur = this.getAndInc(fullKey)
        const occur = fullKey === key
            ? fullOccur
            : this.getAndInc(key)

        const result = new Tag(
            fullKey,
            key,
            idx,
            valuesRaw,
            fullOccur,
            occur,
            [...this.tagPathStack],
        )

        this.tagPathNext = this.tagPathStack.pop() + 1
        return result
    }

    reset() {
        this.tagCounter.clear()
        this.tagPathStack.length = 0
        this.tagPathNext = 0
    }
}

export class TagInfoFactory {
    private fixedLeftOffset: number

    constructor() {
        this.fixedLeftOffset = 0
    }

    addToLeftOffset(newLeftOffset: number): void {
        this.fixedLeftOffset += newLeftOffset
    }

    resetLeftOffset(): number {
        const saveForResult = this.fixedLeftOffset
        this.fixedLeftOffset = 0

        return saveForResult
    }

    build(start: number, end: number, data: Tag, innerTags: TagInfo[], naked: boolean = false): TagInfo {
        return new TagInfo(
            start + this.fixedLeftOffset,
            end + this.fixedLeftOffset,
            data,
            innerTags,
            naked,
        )
    }
}
