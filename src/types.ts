export interface Tag {
    fullKey: string,
    fullOccur: number,
    key: string,
    idx: number | null,
    occur: number,
    valuesRaw: string,
    values?: string[][],
    path: number[],
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

    const mkTag = (fullKey: string, valuesRaw: string | null, path: number[]): Tag => {
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
            valuesRaw: valuesRaw,
            path: path,
        }
    }

    return {
        mkTag: mkTag,
    }
}

export interface TagInfo {
    start: number
    end: number
    data: Tag,
    innerTags: TagInfo[]
}

export const mkTagInfo = (start: number, end = 0, innerTags = []) => ({
    start: start,
    end: end,
    data: null,
    innerTags: innerTags,
})
