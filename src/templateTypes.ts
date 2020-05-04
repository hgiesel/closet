export interface Tag {
    fullKey: string,
    fullOccur: number,
    key: string,
    idx: number | null,
    occur: number,
    values: string[][],
}

const keyPattern = /^([^0-9]+)([0-9]*)$/u

export const tagMaker = () => {
    const tagCounter = new Map()

    const getAndInc = (key: string): number => {
        const result = tagCounter.has(key)
            ? tagCounter.get(key) + 1
            : 0

        tagCounter.set(key, result)
        return result
    }

    const mkTag = (fullKey: string, values: string[][]): Tag => {
        const match = fullKey.match(keyPattern)

        const key = match[1]
        const idx = match[2].length === 0 ? null : Number(match[2])

        const fullOccur = getAndInc(fullKey)
        const occur = fullKey === key
            ? fullOccur
            : getAndInc(key)

        return {
            fullKey: fullKey,
            fullOccur: fullOccur,
            key: key,
            idx: idx,
            occur: occur,
            values: values,
        }
    }

    return {
        mkTag: mkTag,
    }
}

export interface TagInfo {
    start: number
    end: number
    tag: Tag,
    innerTags: TagInfo[]
}

export const mkTagInfo = (start: number) => ({
    start: start,
    end: 0,
    tag: null,
    innerTags: [],
})
