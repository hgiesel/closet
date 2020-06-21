import type { FilterProcessor } from './filterManager'
import type { TagInfo } from './tags'

import { calculateCoordinates, replaceAndGetOffset, removeViaBooleanList } from './utils'
import { Status } from './filterManager'

const isReady = (v: Status): boolean => v !== Status.NotReady

// traverses in postfix order
export const postfixReplace = (baseText: string, rootTag: TagInfo, baseDepth: number, filterProcessor: FilterProcessor): [string, number[], Status, [number, number][]] => {
    const baseStack = []

    const tagReduce = ([text, tagPath, stack, statusStack]: [string, number[], number[], Status[]], tagInfo: TagInfo): [string, number[], number[], Status[]] => {
        /** 
         *
         * @param text - text with tags, is modified throughout the function
         * @param tagPath - used for roundInfo path info, indicates location of tag as a string of numbers
         * @param stack - the number stack for the pushdown automaton logic of the function - used to calculate left offset and inner offset
         * @param readyStack - used to indicate whether inner tags are ready
         */

        // going DOWN
        stack.push(stack[stack.length - 1])

        const [
            innerText,
            /* tagPath */,
            innerStack,
            innerStatusStack,
        ] = tagInfo.innerTags.reduce(tagReduce, [text, [...tagPath, 0], stack, []])

        // get offsets
        const innerOffset = innerStack.pop() - innerStack[innerStack.length - 1]
        const leftOffset = innerStack.pop()

        ///////////////////// Updating valuesRaw and values with innerTags
        const [
            lend,
            rend,
        ] = calculateCoordinates(tagInfo.start, tagInfo.end, leftOffset, innerOffset)

        // correctly treat the base levels: they don't have have tags!
        const depth = tagPath.length
        const tagData = depth < baseDepth
            ? tagInfo.data.shadowFromText(innerText, lend, rend)
            : tagInfo.data.shadowFromTextWithoutDelimiters(innerText, lend, rend)

        // save uppermost tags beneath base
        if (depth === baseDepth - 1) {
            baseStack.push([lend, rend])
        }

        // whether all innerTags are ready
        const modReady = innerStatusStack.reduce((accu: boolean, v: Status) => accu && isReady(v), true)

        ///////////////////// Evaluate current tag
        const filterOutput = filterProcessor(tagData, {
            path: tagPath,
            ready: modReady,
            depth: depth,
        })

        // whether this tagInfo itself is ready
        statusStack.push(filterOutput.status)

        const [
            newText,
            newOffset,
        ] = replaceAndGetOffset(innerText, filterOutput.result, lend, rend)

        // going UP
        const sum = innerOffset + leftOffset + newOffset
        innerStack.push(sum)

        tagInfo.update(
            lend,
            rend + newOffset,
            isReady(filterOutput.status) ? tagData.shadow(filterOutput.result) : tagData,
            removeViaBooleanList(tagInfo.innerTags, innerStatusStack.map(isReady)),
        )

        if (tagPath.length !== 0) {
            tagPath.push(tagPath.pop() + 1)
        }

        return [
            newText,
            tagPath,
            innerStack,
            // ready means everything to the left is ready
            // filterOutput.ready means everything within and themselves are ready
            statusStack,
        ]
    }

    const [
        modifiedText,
        /* tagPath */,
        stack,
        status,
    ] = tagReduce([baseText, [], [0,0], []], rootTag)

    return [modifiedText, stack, status[0], baseStack]
}
