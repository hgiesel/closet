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
import { parseTemplate, parseDisconnectedTemplate } from './parser'

import {
    TAG_OPEN,
    TAG_CLOSE,
    ARG_SEP,
} from './utils'

const MAX_ITERATIONS = 50

export const renderTemplate = (text: string, filterManager: FilterManager): string => {
    let result = text
    let ready = false

    for (let i = 0; i < MAX_ITERATIONS && !ready; i++) {
        const rootTag = parseTemplate(result)
        const templateApi = new TemplateApi(rootTag)

        const [
            newText,
            /* finalOffset */,
            innerReady,
            /* baseStack: not important here: [0, newText.length] */,
        ] = postfixTraverse(
            result,
            rootTag,
            1,
            filterManager.filterProcessor({
                iteration: {
                    index: i,
                },
                template: templateApi,
                baseDepth: 1,
            })
        )

        console.info(
            `ITERATION ${i}: `,
            `"${result}"`,
            `"${newText}"`,
        )

        result = newText
        ready = innerReady

        filterManager.executeDeferred()
    }

    return result
}

// export const renderDisconnnectedTemplate = (textFragments: string[], filterManager: FilterManager): string[] => {
// }


// try to make it more PDA
const postfixTraverse = (baseText: string, rootTag: TagInfo, baseDepth: number, filterProcessor: FilterProcessor): [string, number[], boolean, number[]] => {
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
