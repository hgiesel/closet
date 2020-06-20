import { TagData, TagInfo } from '../tags'

export type TagBuilderSettings = [Map<string, number>, number[], number]

export class TagBuilder {
    private tagCounter: Map<string, number>

    private tagPathStack: number[]
    private tagPathNext: number

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

        this.tagPathNext = this.tagPathStack.length === 0
            ? 0
            : this.tagPathStack.pop() + 1

        return result
    }

    pop(): TagBuilderSettings {
        const saveStats: TagBuilderSettings = [
            new Map(this.tagCounter),
            [...this.tagPathStack],
            this.tagPathNext,
        ]

        this.tagCounter.clear()
        this.tagPathStack.length = 0
        this.tagPathNext = 0

        return saveStats
    }

    push(tagCounter: Map<string, number>, tagPathStack: number[], tagPathNext: number): void {
        this.tagCounter = tagCounter
        this.tagPathStack = tagPathStack
        this.tagPathNext = tagPathNext
    }
}

export class TagInfoBuilder {
    private fixedLeftOffset: number

    constructor() {
        this.fixedLeftOffset = 0
    }

    addLeftOffset(newLeftOffset: number): void {
        this.fixedLeftOffset += newLeftOffset
    }

    build(start: number, end: number, data: TagData, innerTags: TagInfo[]): TagInfo {
        return new TagInfo(
            start + this.fixedLeftOffset,
            end + this.fixedLeftOffset,
            data,
            innerTags,
        )
    }

    pop(): number {
        const saveForResult = this.fixedLeftOffset
        this.fixedLeftOffset = 0

        return saveForResult
    }

    push(newLeftOffset: number): void {
        this.fixedLeftOffset = newLeftOffset
    }
}
