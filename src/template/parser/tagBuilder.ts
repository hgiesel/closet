import { TagData } from '../tags'

export type TagBuilderSettings = [Map<string, number>, Map<string, number>]

export class TagBuilder {
    protected tagCounter: Map<string, number> = new Map()
    protected tagCounterFull: Map<string, number> = new Map()

    protected getAndInc(key: string): number {
        const result = (this.tagCounter.get(key) ?? - 1) + 1

        this.tagCounter.set(key, result)
        return result
    }

    protected getAndIncFull(key: string): number {
        const result = (this.tagCounterFull.get(key) ?? -1) + 1

        this.tagCounterFull.set(key, result)
        return result
    }

    build(fullKey: string, innerNodes: string | null): TagData {
        const result = new TagData(fullKey, innerNodes)

        const fullOccur = this.getAndIncFull(result.fullKey)
        const occur = this.getAndInc(result.key)

        result.setOccur(fullOccur, occur)
        return result
    }

    push(settings: TagBuilderSettings): void {
        this.tagCounterFull = settings[0]
        this.tagCounter = settings[1]
    }
}
