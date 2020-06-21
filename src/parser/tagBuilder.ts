import { TagData, TagInfo } from '../tags'

export type TagBuilderSettings = Map<string, number>

export class TagBuilder {
    private tagCounter: Map<string, number>

    private getAndInc(key: string): number {
        const result = this.tagCounter.has(key)
            ? this.tagCounter.get(key) + 1
            : 0

        this.tagCounter.set(key, result)
        return result
    }

    build(fullKey: string, valuesText: string | null): TagData {
        // you need to signalTagOpen, before you build, otherwise they have all [] path
        const result = new TagData(fullKey, valuesText)

        const fullOccur = this.getAndInc(result.fullKey)

        result.setOccur(
            fullOccur,
            result.fullKey === result.key ? fullOccur : this.getAndInc(result.key),
        )

        return result
    }

    pop(): TagBuilderSettings {
        const saveStats = new Map(this.tagCounter)
        this.tagCounter.clear()

        return saveStats
    }

    push(tagCounter: TagBuilderSettings): void {
        this.tagCounter = tagCounter
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
