import parseTemplate from './templateParser'

import type {
    FilterResult,
} from './filterManager/types'

import type {
    Tag,
    TagInfo,
} from '../types'

import {
    TAG_START,
    TAG_END,
    ARG_SEP,
    splitValues,
} from '../types'

const renderTemplate = (text, filterManager) => {
    let result = text

    for (const iteration of filterManager.iterations()) {
        const tags = parseTemplate(text)
        result = postfixOuter(text, tags, iteration)
    }

    return result
}

const spliceSlice = (str, lend, rend, add): string => {
    // We cannot pass negative lend directly to the 2nd slicing operation.
    const leftend = lend < 0
        ? Math.min(0, str.length + lend)
        : lend

    return str.slice(0, leftend) + (add || "") + str.slice(rend)
}

const mkTagApi = (text, tags) => {
    const getText = (): string => text
    const updateText = (newText: string): void => {
        text = newText
    }

    const exists = (path: number[]): boolean => {
        let currentPos = tags

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

    const getPath = (path: number[]): TagInfo => {
        let currentPos = tags

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

    return {
        getText: getText,
        updateText: updateText,
        get: getPath,
        exists: exists,
    }
}

const postfixOuter = (text, tags, filterManager) => {
    const stack = [0]

    let sum = 0
    let processedText = text

    const tagApi = mkTagApi(text, tags)

    const postfixInner = (tag: TagInfo, i: number): FilterResult => {
        stack.push(sum)

        const innerResults = tag.innerTags.map(postfixInner)

        stack.push(tag.innerTags.length > 0
            ? sum - stack[stack.length - 1] /* stack.peek() */
            : 0
        )

        const innerOffset = stack.pop()
        const leftOffset = stack.pop()

        // values is still null at this point
        tag.data.values = splitValues(processedText.slice(
            tag.start + leftOffset + TAG_START.length + tag.data.fullKey.length + ARG_SEP.length,
            tag.end + leftOffset + innerOffset - TAG_END.length,
        ))

        const filterOutput = filterManager.processFilter(tag.data.key, tag.data, tagApi)
        const newOffset = filterOutput.result.length - (tag.end - tag.start)

        sum = innerOffset + leftOffset + newOffset
        processedText = spliceSlice(
            processedText,
            tag.start + leftOffset,
            tag.end + leftOffset + innerOffset,
            filterOutput.result,
        )

        return filterOutput
    }

    tags.forEach(postfixInner)
    return processedText
}

export default renderTemplate
