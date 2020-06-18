import {
    TAG_OPEN,
    TAG_CLOSE,
    ARG_SEP,
} from '../utils'

interface SeparatorOption {
    sep: string
    max?: number
}

const splitValues = (text: string, ...seps: SeparatorOption[]): unknown[] => {
    const [{ sep, max=Infinity }, ...nextSeps] = seps

    let textSplit = text

    const splits = []

    for (let i = 1; textSplit.length !== 0 && i < max; i++) {
        const pos = textSplit.indexOf(sep)
        const [ currentSplit, rest ] = pos >= 0
            ? [textSplit.slice(0, pos), textSplit.slice(pos + sep.length)]
            : [textSplit, '']

        splits.push(currentSplit)
        textSplit = rest
    }

    if (textSplit.length !== 0) {
        splits.push(textSplit)
    }

    return nextSeps.length === 0
        ? splits
        : splits.map(v => splitValues(v, ...nextSeps))
}

const keyPattern = /^([^0-9]+)([0-9]*)$/u

export class TagData {
    readonly fullKey: string
    readonly key: string
    readonly num: number | null

    readonly valuesText: string

    readonly fullOccur: number
    readonly occur: number

    readonly path: number[]

    constructor(
        fullKey: string,
        valuesText: string | null,
        fullOccur: number,
        occur: number,
        path: number[],
    ) {
        this.fullKey = fullKey

        const match = fullKey.match(keyPattern)
        this.key = match[1]
        this.num = match[2].length === 0 ? null : Number(match[2])

        this.valuesText = valuesText

        this.fullOccur = fullOccur
        this.occur = occur

        this.path = path
    }

    shadow(newValuesText: string | null): TagData {
        return new TagData(
            this.fullKey,
            newValuesText,
            this.fullOccur,
            this.occur,
            this.path,
        )
    }

    values(...seps: SeparatorOption[]): unknown[] {
        return splitValues(this.valuesText, ...seps.map(v => typeof v === 'string' ? { sep: v } : v))
    }

    getDefaultRepresentation(): string {
        return this.valuesText === null
            ? `${TAG_OPEN}${this.fullKey}${TAG_CLOSE}`
            : `${TAG_OPEN}${this.fullKey}${ARG_SEP}${this.valuesText}${TAG_CLOSE}`
    }

    getRawRepresentation(): string {
        return this.valuesText ?? ''
    }

    getFilterKey(): string {
        return this.key
    }
}

export class TagInfo {
    readonly start: number
    readonly end: number

    readonly data: TagData
    readonly innerTags: TagInfo[]

    constructor(
        start: number,
        end: number,
        data: TagData,
        innerTags: TagInfo[],
    ) {
        this.start = start
        this.end = end
        this.data = data
        this.innerTags = innerTags
    }
}
