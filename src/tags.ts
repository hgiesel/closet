import {
    TagInfo
} from './types'

class TagApi {
    private text: string
    private tags: TagInfo

    constructor(text: string, tags: TagInfo) {
        this.text = text
        this.tags = tags
    }

    getText(): string {
        return this.text
    }

    updateText(newText: string): void {
        this.text = newText
    }

    exists(path: number[]): boolean {
        let currentPos = this.tags

        for (const p of path) {
            if (currentPos.innerTags[p]) {
                currentPos = currentPos.innerTags[p]
            }

            else {
                return false
            }
        }

        return true
    }

    getPath(path: number[]): TagInfo | null {
        let currentPos = this.tags

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
}

export default TagApi
