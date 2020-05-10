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
    private text: string
    private zoom: TagPath

    constructor(text: string) {
        this.rootTag = parseText(text)
        this.text = text
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

    getBaseText(): string {
        return this.text
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


    resolve(_filterManager: FilterManager): string {
        return ''
    }

//     reduceInner(pat

//     private *iterations() {
//         while (!rootTag.isReadyRecursive()) {
//             yield this.filterManager processFilter

//             filterManager.executeAndClearDeferred()

//         }
//     }

}

export default TagApi




const postfixTraverse = (template: TemplateApi): [string, number[]] => {

    // return tagReduce([template.getBaseText(), template.getOffsets()], template.getTagInfo())
    return tagReduce([template.getBaseText(), template.getOffsets()], template.getTagInfo())
}

const tagReduce = ([text, stack]: [string, number[]], tag: TagInfo): number[] => {

    // going DOWN
    stack.push(stack[stack.length - 1])

    const [
        modText,
        modStack,
    ] = tag.innerTags.reduce(tagReduce, [text, stack])

    // get offsets
    modStack.push(modStack.pop() - modStack[modStack.length - 1])
    const innerOffset = modStack.pop()
    const leftOffset = modStack.pop()

    const [
        lend,
        rend,
    ] = calculateCoordinates(tag.start, tag.end, leftOffset, innerOffset)

    const repl = filterProcessor(tag.data)

    const [
        _newValuesRaw,
        newText,
    ] = pureReplace(modText, repl, lend, rend)

    // tag.data.updateValuesRaw(newValuesRaw)

    const newOffset = getNewOffset(repl, tag.start, tag.end)

    // going UP
    const sum = innerOffset + leftOffset + newOffset
    modStack.push(sum)

    return [newText, modStack]
}
