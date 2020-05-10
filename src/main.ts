import type {
    FilterManager,
    FilterProcessor,
} from './filterManager'


import type {
    TagInfo,
} from './tags'

import TemplateApi from './template'

import parseTemplate from './parser'

import {
    TAG_START,
    TAG_END,
    ARG_SEP,
} from './utils'

const renderTemplate = (text: string, filterManager: FilterManager): string => {
    let result = text
    let ready = true

    do {
        const rootTag = parseTemplate(result)
        const templateApi = new TemplateApi(rootTag)

        const [
            newText,
            finalOffset,
            innerReady,
        ] = postfixTraverse(text, rootTag, filterManager.filterProcessor({ template: templateApi }))

        ready = innerReady
        result = newText

        filterManager.executeAndClearDeferred()
    } while (!ready)

        return result
}

const spliceSlice = (str: string, lend: number, rend: number, add: string = ''): string => {
    // We cannot pass negative lend directly to the 2nd slicing operation.
    const leftend = lend < 0
        ? Math.min(0, str.length + lend)
        : lend

    return str.slice(0, leftend) + add + str.slice(rend)
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
const postfixTraverse = (baseText: string, rootTag: TagInfo, filterProcessor: FilterProcessor): [string, number[], boolean]=> {
    const tagReduce = ([text, stack, ready]: [string, number[], boolean], tag: TagInfo): [string, number[], boolean] => {

        // going DOWN
        stack.push(stack[stack.length - 1])
        console.info('going down')

        const [
            modText,
            modStack,
            modReady,
        ] = tag.innerTags.reduce(tagReduce, [text, stack, true])

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
            tag.naked
                ? 0
                : TAG_START.length + tag.data.fullKey.length + ARG_SEP.length,
            tag.naked
                ? 0
                : TAG_END.length,
        )

        const tagData = tag.data.shadowValuesRaw(newValuesRaw)

        ///////////////////// Evaluate current tag
        const filterOutput = filterProcessor(tagData, { ready: modReady })
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
        return [newText, modStack, modReady]
    }

    return tagReduce([baseText, [0,0], true], rootTag)
}

export default renderTemplate
