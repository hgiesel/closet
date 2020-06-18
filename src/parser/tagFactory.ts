import { TagData, TagInfo } from '../tagTypes'

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

    build(fullKey: string, valuesText: string | null): TagData {
        // you need to signalTagOpen, before you build, otherwise they have all [] path
        const result = new TagData(fullKey, valuesText, [...this.tagPathStack])

        const fullOccur = this.getAndInc(result.fullKey)

        result.setOccur(
            fullOccur,
            result.fullKey === result.key ? fullOccur : this.getAndInc(result.key),
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

    build(start: number, end: number, data: TagData, innerTags: TagInfo[]): TagInfo {
        return new TagInfo(
            start + this.fixedLeftOffset,
            end + this.fixedLeftOffset,
            data,
            innerTags,
        )
    }
}
