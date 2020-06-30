import type { TagInfo, TagData, Separator } from './tags'
import type { Parser } from './parser'

import { calculateCoordinates, replaceAndGetOffset, flatMapViaStatusList } from './utils'

export interface RoundInfo {
    path: number[]
    depth: number
    ready: boolean
    capture: boolean
}

export enum Status {
    Ready,
    NotReady,
    ContainsTags,
}

export interface ProcessorOutput {
    result: string | null
    status: Status
}

export interface DataOptions {
    separators: Array<string | Partial<Separator>>
    capture: boolean
}

export type TagAccessor = (name: string) => TagProcessor

export interface TagProcessor {
    execute: (data: TagData, round: RoundInfo) => ProcessorOutput
    getOptions: () => DataOptions
}

const isReady = (v: Status): boolean => v === Status.Ready
const canReplace = (v: Status): boolean => v !== Status.NotReady

export const evaluateTemplate = (baseText: string, rootTag: TagInfo, baseDepth: number, tagAccessor: TagAccessor, parser: Parser): [string, number[], boolean, [number, number][]] => {
    const baseStack: [number, number][] = []

    const foldTag = ([text, tagPath, stack, statusStack]: [string, number[], number[], Status[]], tagInfo: TagInfo): [string, number[], number[], Status[]] => {
        /** 
         * traverses in postfix order through tag tree
         *
         * @param text - text with tags, is modified throughout the function
         * @param tagPath - used for roundInfo path info, indicates location of tag as a string of numbers
         * @param stack - the number stack for the pushdown automaton logic of the function - used to calculate left offset and inner offset
         * @param readyStack - used to indicate whether inner tags are ready
         */

        // going DOWN
        const tagProcessor = tagAccessor(tagInfo.data.getFilterKey(/* filterKey cannot change from inner replacement */))
        const depth = tagPath.length

        stack.push(stack[stack.length - 1])

        const [
            wasCapture,
            innerText,
            /* tagPath */,
            innerStack,
            innerStatusStack,
        ]: [boolean, string, number[], number[], Status[]] = tagProcessor.getOptions().capture
            ? [true, text, tagPath, stack, tagInfo.innerTags.map((_v: TagInfo) => Status.NotReady)] 
            : [false, ...tagInfo.innerTags.reduce(foldTag, [text, [...tagPath, 0], stack, []]) as [string, number[], number[], Status[]]]

        // going UP
        const innerOffset = innerStack.pop() as number - innerStack[innerStack.length - 1]
        const leftOffset = innerStack.pop() as number

        ///////////////////// Updating valuesRaw and values with innerTags
        const [
            lend,
            rend,
        ] = calculateCoordinates(tagInfo.start, tagInfo.end, leftOffset, innerOffset)

        // correctly treat the base levels: they don't have have tags!
        const tagData = depth < baseDepth
            ? tagInfo.data.shadowFromText(innerText, lend, rend)
            : tagInfo.data.shadowFromTextWithoutDelimiters(innerText, lend, rend)

        console.log('ttp', innerText, tagPath, tagData)

        // save uppermost tags beneath base
        if (depth === baseDepth - 1) {
            baseStack.push([lend, rend])
        }

        // whether all innerTags are ready
        const allReady = innerStatusStack.reduce((accu: boolean, v: Status) => accu && isReady(v), true)

        ///////////////////// Evaluate current tag

        tagData.setSeparators(tagProcessor.getOptions().separators)

        const roundInfo: RoundInfo = {
            path: tagPath,
            depth: depth,
            ready: allReady,
            capture: wasCapture,
        }

        const filterOutput = tagProcessor.execute(tagData, roundInfo)

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
            canReplace(filterOutput.status) ? tagData.shadow(filterOutput.result) : tagData,
            flatMapViaStatusList(parser, tagInfo.innerTags, innerStatusStack),
        )

        if (tagPath.length > 0) {
            tagPath.push(tagPath.pop() as number + 1)
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
    ] = foldTag([baseText, [], [0,0], []], rootTag)

    return [modifiedText, stack, isReady(status[0]), baseStack]
}
