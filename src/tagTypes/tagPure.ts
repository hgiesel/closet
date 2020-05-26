import {
    TAG_OPEN,
    TAG_CLOSE,
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

    getDefaultRepresentation(): string {
        return this.valuesRaw === null
            ? `${TAG_OPEN}${this.fullKey}${TAG_CLOSE}`
            : `${TAG_OPEN}${this.fullKey}${ARG_SEP}${this.valuesRaw}${TAG_CLOSE}`
    }

    getRawRepresentation(): string {
        return this.valuesRaw ?? ''
    }

    getFilterKey(): string {
        return this.key
    }
}

export default Tag
