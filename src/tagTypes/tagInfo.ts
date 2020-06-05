import Tag from './tagPure'

class TagInfo {
    readonly start: number
    readonly end: number

    readonly data: Tag
    readonly innerTags: TagInfo[]

    constructor(
        start: number,
        end: number,
        data: Tag,
        innerTags: TagInfo[],
    ) {
        this.start = start
        this.end = end
        this.data = data
        this.innerTags = innerTags
    }
}

export default TagInfo
