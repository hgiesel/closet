import {
    TAG_OPEN,
    TAG_CLOSE,
    ARG_SEP,
} from './utils'

export interface DataOptions {
    separators: Array<string | Partial<Separator>>
    capture: boolean
}

export interface Separator {
    sep: string
    max: number
}

const splitValues = (text: string, seps: Separator[]) => {
    if (seps.length === 0) {
        return text
    }

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
        : splits.map(v => splitValues(v, nextSeps))
}

const keyPattern = /^([^0-9]+)([0-9]*)$/u

export class TagData {
    readonly fullKey: string
    readonly key: string
    readonly num: number | null

    separators: Separator[] = []
    readonly valuesText: string | null

    _fullOccur: number
    _occur: number

    capture: boolean = false

    constructor(
        fullKey: string,
        valuesText: string | null,
    ) {
        this.fullKey = fullKey

        const match = fullKey.match(keyPattern)
        this.key = match[1]
        this.num = match[2].length === 0 ? null : Number(match[2])

        this.valuesText = valuesText
    }

    private setSeparators(seps: Array<string | Partial<Separator>>) {
        this.separators = seps.map((v: string | Partial<Separator>): Separator => typeof v === 'string'
            ? { sep: v, max: Infinity }
            : { sep: v.sep ?? '::', max: v.max ?? Infinity })
    }

    setOptions(wdo: Partial<DataOptions> = {}) {
        // default options from filter manager is {}
        this.setSeparators(wdo.separators ?? [])
        this.capture = wdo.capture ?? false
    }

    hasValues(): boolean {
        return this.valuesText === null
    }

    get values() {
        return this.valuesText === null
            ? null
            : splitValues(this.valuesText, this.separators)
    }

    get fullOccur() {
        return this._fullOccur
    }

    get occur() {
        return this._occur
    }

    setOccur(fullOccur: number, occur: number) {
        this._fullOccur = fullOccur
        this._occur = occur
    }

    shadow(newValuesText: string | null): TagData {
        const result = new TagData(
            this.fullKey,
            newValuesText,
        )

        result.setOccur(this.fullOccur, this.occur)
        return result
    }

    shadowFromText(text: string, lend: number, rend: number): TagData {
        return this.shadow(text.slice(lend, rend))
    }

    shadowFromTextWithoutDelimiters(text: string, lend: number, rend: number): TagData {
        return this.hasValues()
            ? this.shadow(null)
            : this.shadowFromText(
                text,
                lend + (TAG_OPEN.length + this.fullKey.length + ARG_SEP.length),
                rend - (TAG_CLOSE.length),
            )
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
    private _start: number
    private _end: number

    private _data: TagData
    private _innerTags: TagInfo[]

    constructor(
        start: number,
        end: number,
        data: TagData,
        innerTags: TagInfo[],
    ) {
        this._start = start
        this._end = end
        this._data = data
        this._innerTags = innerTags
    }

    get start() {
        return this._start
    }

    get end() {
        return this._end
    }

    get data() {
        return this._data
    }

    get innerTags() {
        return this._innerTags
    }

    update(
        start: number,
        end: number,
        data: TagData,
        innerTags: TagInfo[],
    ) {
        this._start = start
        this._end = end
        this._data = data
        this._innerTags = innerTags
    }
}
