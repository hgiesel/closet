import type { FilterProcessor } from './filterManager'
import type { TagInfo } from './tags'

import { calculateCoordinates, replaceAndGetOffset, removeViaBooleanList } from './utils'

// traverses in postfix order
export const postfixReplace = (baseText: string, rootTag: TagInfo, baseDepth: number, filterProcessor: FilterProcessor): [string, number[], boolean[], [number, number][]] => {
    const baseStack = []

    const tagReduce = ([text, tagPath, stack, readyStack]: [string, number[], number[], boolean[]], tagInfo: TagInfo): [string, number[], number[], boolean[]] => {

        // going DOWN
        stack.push(stack[stack.length - 1])

        const [
            modText,,
            modStack,
            modReadyStack,
        ] = tagInfo.innerTags.reduce(tagReduce, [text, [...tagPath, 0], stack, []])

        // get offsets
        const innerOffset = modStack.pop() - modStack[modStack.length - 1]
        const leftOffset = modStack.pop()

        ///////////////////// Updating valuesRaw and values with innerTags
        const [
            lend,
            rend,
        ] = calculateCoordinates(tagInfo.start, tagInfo.end, leftOffset, innerOffset)

        // correctly treat the base levels: they don't have have tags!
        const depth = tagPath.length + 1
        const tagData = depth <= baseDepth
            ? tagInfo.data.shadowFromText(modText, lend, rend)
            : tagInfo.data.shadowFromTextWithoutDelimiters(modText, lend, rend)

        // save base tags
        if (depth === baseDepth) {
            baseStack.push([lend, rend])
        }

        // whether all innerTags are ready
        const modReady = modReadyStack.reduce((accu: boolean, v: boolean) => accu && v, true)

        ///////////////////// Evaluate current tag
        const filterOutput = filterProcessor(tagData, {
            path: tagPath,
            ready: modReady,
            depth: depth,
        })

        // whether this tagInfo itself is ready
        readyStack.push(modReady && filterOutput.ready)

        const [
            newText,
            newOffset,
        ] = replaceAndGetOffset(modText, filterOutput.result, lend, rend)

        // going UP
        const sum = innerOffset + leftOffset + newOffset
        modStack.push(sum)

        tagInfo.update(
            lend,
            rend + newOffset,
            filterOutput.ready ? tagData.shadow(filterOutput.result) : tagData,
            removeViaBooleanList(tagInfo.innerTags, modReadyStack),
        )

        if (tagPath.length !== 0) {
            tagPath.push(tagPath.pop() + 1)
        }

        return [
            newText,
            tagPath,
            modStack,
            // ready means everything to the left is ready
            // filterOutput.ready means everything within and themselves are ready
            readyStack,
        ]
    }

    const [
        modifiedText,,
        stack,
        ready,
    ] = tagReduce([baseText, [], [0,0], []], rootTag)

    return [modifiedText, stack, ready, baseStack]
}
