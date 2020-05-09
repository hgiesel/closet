import {
    TagMaker,
    TagInfo,
} from '../tags'

const tagKeeper = function*() {
    const tm = new TagMaker()
    const tagInfos = new TagInfo(0)

    const getTagInfo = (path: number[]) => {
        let reference = tagInfos

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

            const foundTag = getTagInfo(tagStack)
            foundTag.close(endIndex, tm.makeTag(value[1], value[2] ?? null, [...tagStack]))

            if (tagStack.length === 0) {
                return tagInfos
            }
            else {
                nextLevel = tagStack.pop() + 1
            }
        }
    }
}

class TagKeeper {
    tk: any

    constructor() {
        this.tk = tagKeeper()
        this.tk.next()
    }

    startToken(offset: number) {
        return this.tk.next([offset])
    }

    endToken(offset: number, key: string, valuesRaw: number) {
        return this.tk.next([-offset, key, valuesRaw])
    }

    restart() {
        this.tk = tagKeeper()
        this.tk.next()
    }
}

export default TagKeeper
