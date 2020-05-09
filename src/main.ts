import type {
    FilterResult,
    FilterManager,
} from './filterManager/types'

import type {
    Tag,
    TagInfo,
    TagApi,
} from './types'

import parseTemplate from './parser'

import {
    TAG_START,
    TAG_END,
    ARG_SEP,
    splitValues,
} from './utils'

const renderTemplate = (text, filterManager) => {
    let result = text

    for (const iteration of filterManager.iterations()) {
        const rootTag = parseTemplate(text)
        const tagApi = mkTagApi(text, rootTag)

        result = postfixTraverse(text, rootTag, tagApi, iteration)
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

    const getPath = (path: number[]): TagInfo | null => {
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

const getNewValuesRaw = (
    fromText: string,
    tagStartIndex: number,
    tagEndIndex: number,
    leftOffset: number,
    innerOffset: number,
    customLend: number,
    customRend: number,
): string => {
    const lend = tagStartIndex + leftOffset + customLend
    const rend = tagEndIndex + leftOffset + innerOffset - customRend

    return fromText.slice(lend, rend)
}

// try to make it more PDA
const postfixTraverse = (baseText: string, rootTag: TagInfo, tagApi: TagApi, filterProcessor) => {
    const tagReduce = ([text, stack]: [string, number[]], tag: TagInfo): [string, number[]] => {

        // going DOWN
        stack.push(stack[stack.length - 1])
        console.info('going down')

        const [
            modText,
            modStack,
        ] = tag.innerTags.reduce(tagReduce, [text, stack])

        // get offsets
        modStack.push(modStack.pop() - modStack[modStack.length - 1])

        const innerOffset = modStack.pop()
        const leftOffset = modStack.pop()
        console.log('oooo', innerOffset, leftOffset, ':::', modStack, tag.data.path)

        ///////////////////// Updating valuesRaw and values with innerTags
        const newValuesRaw = getNewValuesRaw(
            modText,
            tag.start,
            tag.end,
            leftOffset,
            innerOffset,
            tag.data.path.length === 0
                ? 0
                : TAG_START.length + tag.data.fullKey.length + ARG_SEP.length,
            tag.data.path.length === 0
                ? 0
                : TAG_END.length,
        )

        tag.data.valuesRaw = newValuesRaw
        // values is still null at this point
        tag.data.values = splitValues(tag.data.valuesRaw)

        ///////////////////// Evaluate current tag
        const filterOutput = filterProcessor(tag.data.key, tag.data, tagApi)
        const newOffset = filterOutput.result.length - (tag.end - tag.start)

        const sliceFrom = tag.start + leftOffset
        const sliceTill = tag.end + leftOffset + innerOffset

        const newText = spliceSlice(
            modText,
            sliceFrom,
            sliceTill,
            filterOutput.result,
        )

        // going UP
        const sum = innerOffset + leftOffset + newOffset
        modStack.push(sum)

        console.info('going up')
        console.log('yyy', filterOutput.result, filterOutput.result.length, tag.start, tag.end, tag)
        console.log('zzz', newOffset, sum, modStack)
        return [newText, modStack]
    }

    const result = tagReduce([baseText, [0,0]], rootTag)
    console.info('result: ', result)
    return result[0]
}

export default renderTemplate
