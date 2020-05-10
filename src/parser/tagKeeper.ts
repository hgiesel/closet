import {
    TagInfo,
} from '../tags'

import TagMaker from './tagMaker'

const tagKeeper = function*(): Generator<number[], TagInfo, [number, string?, string?, boolean?]> {
    const tm = new TagMaker()
    const rootTag = new TagInfo(0)

    const getTagInfo = (path: number[]): TagInfo => {
        let reference = rootTag

        for (const id of path) {
            reference = reference.innerTags[id]
        }

        return reference
    }

    const tagStack: number[] = []
    let nextLevel = 0

    while (true) {
        let value = yield tagStack

        if (value[0] >= 0) /* start */ {
            const startIndex = value[0]
            getTagInfo(tagStack).addInnerTag(new TagInfo(startIndex))

            tagStack.push(nextLevel)
            nextLevel = 0
        }

        else /* end */ {
            const endIndex = Math.abs(value[0])
            const fullKey = value[1]
            const valuesRaw = value[2] ?? null
            const naked = value[3]

            const foundTag = getTagInfo(tagStack)
            foundTag.close(endIndex, tm.makeTag(fullKey, valuesRaw, [...tagStack]), naked)

            if (tagStack.length === 0) {
                return rootTag
            }
            else {
                nextLevel = tagStack.pop() + 1
            }
        }
    }
}

class TagKeeper {
    tk: Generator<number[], TagInfo, [number, string?, string?, boolean?]>

    constructor() {
        this.tk = tagKeeper()
        this.tk.next()
    }

    startToken(offset: number) {
        return this.tk.next([offset])
    }

    endToken(offset: number, key: string, valuesRaw: string | null, naked = false) {
        return this.tk.next([-offset, key, valuesRaw, naked])
    }

    restart() {
        this.tk = tagKeeper()
        this.tk.next()
    }
}

export default TagKeeper
