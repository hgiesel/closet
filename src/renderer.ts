import {
    Tag,
    TagInfo,
    TagApi,
} from './tags'

import parseTemplate from './parser'

import FilterManager from './tags/filterManager'


interface FilterResultRenderer {
    result: string | null
    ready: boolean
}


class Renderer {
    tagApi: TagApi
    filterManager: FilterManager

    constructor(text: string, filterManager: FilterManager) {
        this.tagApi = new TagApi(parseTemplate(text))
        this.filterManager = filterManager
    }

    traverse(extension: object) {
        const process = this.filterManager.filterProcessor(Object.assign(extension, {
            tag: this.tagApi,
        }))

        tag.traverse

        yield this.filterManager processFilter

        filterManager.executeAndClearDeferred()
    }


    // private *iterations(rootTag: TagInfo) {

    //     while (!rootTag.isReadyRecursive()) {
    //         yield this.filterManager processFilter

    //         filterManager.executeAndClearDeferred()

    //     }
    // }

}


    // iterate(rootTag: TagApi, text: string): IterationResult {

    // }

const renderTemplate = (text: string, filterManager: FilterManager): string => {
    let result = text

    for (const iteration of filterManager.iterations(rootTag)) {
        const rootTag = parseTemplate(text)
        const tagApi: TagApi = new TagApi(text, rootTag)

        result = postfixTraverse(text, rootTag, tagApi, iteration)
    }

    return result
}

interface IterationResult {
    result: string,
    innerOffset: number,
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

        tag.data.updatevaluesRaw(newValuesRaw)

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


















































// try to make it more PDA
const postfixTraverse = (q: TagApi) => {
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

        const filterOutput = filterProcessor(tag.data.key, tag.data, tagApi)

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

        tag.data.updatevaluesRaw(newValuesRaw)

        ///////////////////// Evaluate current tag
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
