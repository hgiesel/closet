import {
    TAG_START,
    TAG_END,
    ARG_SEP,
} from '../utils'

const splitValues = (valuesRaw: string | null): string[][] =>
    valuesRaw === null
        ? []
        : valuesRaw.split(ARG_SEP).map(arg => arg.split('||'))

class Tag {
    readonly fullKey: string
    readonly key: string
    readonly num: number | null

    readonly valuesRaw: string
    readonly values: string[][]

    readonly fullOccur: number
    readonly occur: number

    readonly path: number[]

    constructor(
        fullKey: string,
        key: string,
        num: number | null,
        valuesRaw: string | null,
        fullOccur: number,
        occur: number,
        path: number[],
    ) {
        this.fullKey = fullKey
        this.key = key
        this.num = num

        this.valuesRaw = valuesRaw
        this.values = splitValues(valuesRaw)

        this.fullOccur = fullOccur
        this.occur = occur

        this.path = path
    }

    shadowValuesRaw(newValuesRaw: string | null): Tag {
        return new Tag(
            this.fullKey,
            this.key,
            this.num,
            newValuesRaw,
            this.fullOccur,
            this.occur,
            this.path,
        )
    }

    makeMemoizerKey(): string {
        return `${this.key}:${this.num}:${this.valuesRaw}`
    }

    getDefaultRepresentation(): string {
        return this.valuesRaw === null
            ? `${TAG_START}${this.fullKey}${TAG_END}`
            : `${TAG_START}${this.fullKey}${ARG_SEP}${this.valuesRaw}${TAG_END}`
    }

    getRawRepresentation(): string {
        return this.valuesRaw ?? ''
    }

    getFilterKey(): string {
        return this.key
    }
}

export default Tag
