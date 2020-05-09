import {
    ARG_SEP,
} from './utils'

const keyPattern = /^([^0-9]+)([0-9]*)$/u

const splitValues = (valuesRaw: string | null): string[][] =>
    valuesRaw === null
        ? []
        : valuesRaw.split(ARG_SEP).map(arg => arg.split('||'))

class Tag {
    readonly fullKey: string
    readonly key: string
    readonly idx: number | null

    private _valuesRaw: string
    private _values: string[][]

    readonly fullOccur: number
    readonly occur: number

    readonly path: number[]

    constructor(
        fullKey: string,
        key: string,
        idx: number | null,
        valuesRaw: string | null,
        fullOccur: number,
        occur: number,
        path: number[],
    ) {
        this.fullKey = fullKey
        this.key = key
        this.idx = idx

        this._valuesRaw = valuesRaw
        this._values = splitValues(valuesRaw)

        this.fullOccur = fullOccur
        this.occur = occur

        this.path = path
    }

    updatevaluesRaw(v: string) {
        this._valuesRaw = v
        this._values = splitValues(this.valuesRaw)
    }

    get valuesRaw() {
        return this._valuesRaw
    }

    get values() {
        return this._values
    }
}

export type { Tag }

export class TagMaker {
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

export class TagInfo {
    readonly start: number
    end: number
    data: Tag
    readonly innerTags: TagInfo[]

    constructor(start: number, end: number = 0, innerTags = []) {
        this.start = start
        this.end = end
        this.innerTags = innerTags
    }

    close(end: number, data: Tag) {
        this.end = end
        this.data = data
    }

    addInnerTag(tag: TagInfo) {
        this.innerTags.push(tag)
    }
}

export class TagApi {
    private text: string
    private tags: TagInfo

    constructor(text: string, tags: TagInfo) {
        this.text = text
        this.tags = tags
    }

    getText(): string {
        return this.text
    }

    updateText(newText: string): void {
        this.text = newText
    }

    exists(path: number[]): boolean {
        let currentPos = this.tags

        for (const p of path) {
            if (currentPos.innerTags[p]) {
                currentPos = currentPos.innerTags[p]
            }

            else {
                return false
            }
        }

        return true
    }

    getPath(path: number[]): TagInfo | null {
        let currentPos = this.tags

        for (const p of path) {
            if (currentPos.innerTags[p]) {
                currentPos = currentPos.innerTags[p]
            }

            else {
                return null
            }
        }

        return currentPos
    }
}
