import type {
    FilterManager,
    FilterProcessor,
} from './filterManager'

import type {
    TagInfo,
} from './tags'

import {
    calculateCoordinates,
    replaceAndGetOffset,
} from './utils'

import TemplateApi from './template'
import { parse } from './parser'

import {
    TAG_OPEN,
    TAG_CLOSE,
    ARG_SEP,
} from './utils'

const MAX_ITERATIONS = 50

const splitTextFromIntervals = (text: string, intervals: [number, number][]): string[] => {
    const result = []

    for (const [ivlStart, ivlEnd] of intervals) {
        result.push(text.slice(ivlStart, ivlEnd))
    }

    return result
}

export const baseRender = (text: string[], filterManager: FilterManager, baseDepth: number): string[] => {
    let ready = false

    for (let i = 0; i < MAX_ITERATIONS && !ready; i++) {
        const rootTag = parse(text, baseDepth)
        const templateApi = new TemplateApi(rootTag)

        const iterationInfo = {
            iteration: {
                index: i,
            },
            template: templateApi,
            baseDepth: baseDepth,
        }

        const [
            newText,
            /* finalOffset */,
            innerReady,
            baseStack,
        ] = postfixTraverse(
            text.join(''),
            rootTag,
            baseDepth,
            filterManager.filterProcessor(iterationInfo),
        )

        text = splitTextFromIntervals(newText, baseStack)
        ready = innerReady

        filterManager.executeDeferred(iterationInfo)
    }

    return text
}

export const renderTemplate = (text: string, filterManager: FilterManager, cb: (output: string) => void = null): string => {
    const baseDepth = 1
    const result = baseRender([text], filterManager, baseDepth)[0]

    if (cb) {
        cb(result)
    }

    filterManager.executeAftermath()
    filterManager.reset()

    return result
}

export const renderDisjointTemplate = (textFragments: string[], filterManager: FilterManager, cb: (output: string[]) => void): string[] => {
    const baseDepth = 2
    const result = baseRender(textFragments, filterManager, baseDepth)

    if (cb) {
        cb(result)
    }

    filterManager.executeAftermath()
    filterManager.reset()
    return result
}

// try to make it more PDA
const postfixTraverse = (baseText: string, rootTag: TagInfo, baseDepth: number, filterProcessor: FilterProcessor): [string, number[], boolean, [number, number][]] => {
    const baseStack = []

    const tagReduce = ([text, stack, ready]: [string, number[], boolean], tag: TagInfo): [string, number[], boolean] => {

        // going DOWN
        stack.push(stack[stack.length - 1])

        const [
            modText,
            modStack,
            modReady,
        ] = tag.innerTags.reduce(tagReduce, [text, stack, true])

        // get offsets
        modStack.push(modStack.pop() - modStack[modStack.length - 1])

        const innerOffset = modStack.pop()
        const leftOffset = modStack.pop()

        ///////////////////// Updating valuesRaw and values with innerTags
        const [
            lend,
            rend,
        ] = calculateCoordinates(tag.start, tag.end, leftOffset, innerOffset)

        let newValuesRaw = null

        // correctly treat the base levels: they don't have have tags!
        const depth = tag.data.path.length + 1

        if (depth <= baseDepth) {
            newValuesRaw = modText.slice(lend, rend)

            if (depth === baseDepth) {
                baseStack.push([lend, rend])
            }
        }
        else {
            newValuesRaw = tag.data.valuesRaw === null
                ? null
                : modText.slice(
                    lend + (TAG_OPEN.length + tag.data.fullKey.length + ARG_SEP.length),
                    rend - (TAG_CLOSE.length),
                )
        }

        const tagData = tag.data.shadowValuesRaw(newValuesRaw)

        ///////////////////// Evaluate current tag
        const filterOutput = filterProcessor(tagData, {
            ready: modReady,
            depth: depth - baseDepth,
        })

        const [
            newText,
            newOffset,
        ] = filterOutput.result === null
            ? [modText, 0]
            : replaceAndGetOffset(modText, filterOutput.result, lend, rend)

        // going UP
        const sum = innerOffset + leftOffset + newOffset
        modStack.push(sum)

        // console.info('going up:', tag.data.path, modText, '+++', filterOutput.result, '===', newText)
        // console.groupCollapsed('offsets', tag.data.path)
        // console.log('left', leftOffset)
        // console.log('inner' , innerOffset)
        // console.log('new', newOffset)
        // console.info('lend', lend)
        // console.info('rend', rend)
        // console.groupEnd()

        return [
            newText,
            modStack,
            // ready means everything to the left is ready
            // filterOutput.ready means everything within and themselves are ready
            ready && filterOutput.ready
        ]
    }

    const [
        modifiedText,
        stack,
        ready,
    ] = tagReduce([baseText, [0,0], true], rootTag)

    return [modifiedText, stack, ready, baseStack]
}
