import Tag from './tagPure'

class TagInfo {
    readonly start: number
    private _end: number
    private _ready: boolean

    private _data: Tag
    readonly innerTags: TagInfo[]

    private _naked: boolean

    constructor(start: number) {
        this.start = start
        this._ready = false

        this.innerTags = []
    }

    close(end: number, data: Tag, naked: boolean) {
        this._end = end
        this._data = data
        this._naked = naked
    }

    get end() {
        return this._end
    }

    get data() {
        return this._data
    }

    get naked() {
        return this._naked
    }

    isReady() {
        return this._ready
    }

    isReadyRecursive() {
        return this._ready && this.innerTags.map(t => t.isReadyRecursive())
    }

    setReady(b: boolean) {
        this._ready = b
    }

    addInnerTag(tag: TagInfo) {
        this.innerTags.push(tag)
    }
}

export default TagInfo
