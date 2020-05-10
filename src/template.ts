import { TagInfo, Tag } from './tags'
import parseText from './parser'

import {
    pureReplace,
    calculateCoordinates,
    getNewOffset,
} from './utils'

type TagPath = number[]

class TemplateApi {
    private rootTag: TagInfo
    private zoom: TagPath

    constructor(rootTag: TagInfo) {
        this.rootTag = rootTag
        this.zoom = []
    }

    private traverse(path = this.zoom): TagInfo | null {
        let currentPos = this.rootTag

        for (const p of path) {
            if (currentPos.innerTags[p]) {
                currentPos = currentPos.innerTags[p]
            }

            else {
                return null
            }
        }

        return currentPos
    }

    exists(path = this.zoom): boolean {
        const resultTag = this.traverse(path)

        return resultTag
            ? true
            : false
    }

    getTagInfo(path = this.zoom): TagInfo | null {
        return this.traverse(path)
    }

    getTag(path = this.zoom): Tag | null {
        const maybeTagInfo = this.traverse(path)

        if (maybeTagInfo) {
            return maybeTagInfo.data
        }

        return null
    }

    getOffsets(path = this.zoom): [number, number] | null {
        const maybeTagInfo = this.traverse(path)

        if (maybeTagInfo) {
            return [0, maybeTagInfo.start]
        }

        return null
    }

    setZoom(path: TagPath): void {
        this.zoom = path
    }
}

export default TemplateApi
