import type {
    Tag,
    TagInfo,
} from '../templateTypes'

import {
    splitValues,
} from '../templateTypes'

export const applyTemplate = (text, tags, filterManager) => {
    return postfixOuter(text, tags, filterManager)
}

const spliceSlice = (str, lend, rend, add): string => {
    // We cannot pass negative lend directly to the 2nd slicing operation.
    const leftend = lend < 0
        ? Math.min(0, str.length + lend)
        : lend

    return str.slice(0, leftend) + (add || "") + str.slice(rend)
}

const adjustValuesString = (tag: TagInfo, innerTag: TagInfo, adjustment: string): string => {
    return spliceSlice(
        tag.data.valuesRaw,
        innerTag.start - (tag.start + 2 /* opendelim */ + tag.data.fullKey.length + 2 /* sep */),
        innerTag.end - innerTag.start + 1,
        adjustment,
    )
}

const postfixOuter = (text, tags, filterManager) => {
    const stack = [0]
    let sum = 0
    let processedText = text

    const postfixInner = (tag) => {
        stack.push(sum)
        const innerResults = tag.innerTags.map(postfixInner)

        stack.push(tag.innerTags.length > 0
            ? sum - stack[stack.length - 1] /* stack.peek() */
            : 0
        )

        tag.innerTags.forEach((it, idx) =>
            tag.data.valuesRaw = adjustValuesString(tag, it, innerResults[idx])
        )
        tag.data.values = splitValues(tag.data.valuesRaw)

        const result = filterManager.executeFilter(tag.data.key, tag.data)

        const innerOffset = stack.pop()
        const leftOffset = stack.pop()
        const newOffset = result.length - (tag.end - tag.start)

        processedText = spliceSlice(processedText, tag.start + leftOffset, tag.end + leftOffset + innerOffset, result)
        sum = innerOffset + leftOffset + newOffset

        return result
    }

    tags.forEach(postfixInner)
    return processedText
}

export default applyTemplate
