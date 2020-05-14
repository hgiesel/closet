import Tag from './tagPure'

class TagInfo {
    readonly start: number
    readonly end: number

    readonly data: Tag
    readonly innerTags: TagInfo[]

    readonly naked: boolean

    constructor(
        start: number,
        end: number,
        data: Tag,
        innerTags: TagInfo[],
        naked: boolean = false,
    ) {
        this.start = start
        this.end = end
        this.data = data
        this.innerTags = innerTags
        this.naked = naked
    }
}

export default TagInfo
