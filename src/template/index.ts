import parseTemplate from './templateParser'

import type {
    FilterResult,
} from './filterManager/types'

import type {
    Tag,
    TagInfo,
} from '../templateTypes'

import {
    TAG_START,
    TAG_END,
    ARG_SEP,
    splitValues,
} from '../templateTypes'

const renderTemplate = (text, filterManager) => {
    for (const iteration of filterManager.iterations()) {
        const tags = parseTemplate(text)
        text = postfixOuter(text, tags, iteration)
    }

    return text
}

const spliceSlice = (str, lend, rend, add): string => {
    // We cannot pass negative lend directly to the 2nd slicing operation.
    const leftend = lend < 0
        ? Math.min(0, str.length + lend)
        : lend

    return str.slice(0, leftend) + (add || "") + str.slice(rend)
}

const postfixOuter = (text, tags, filterManager) => {
    const stack = [0]

    let sum = 0
    let processedText = text

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
        console.log('fu', tag.data.values)

        const filterOutput = filterManager.processFilter(tag.data.key, tag.data)
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
