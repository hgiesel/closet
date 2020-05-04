export const applyTemplate = (text, tags) => {
    return postfixOuter(text, tags)
}

const spliceSlice = (str, lend, rend, add) => {
    // We cannot pass negative lend directly to the 2nd slicing operation.
    const leftend = lend < 0
        ? Math.min(0, str.length + lend)
        : lend

    return str.slice(0, leftend) + (add || "") + str.slice(rend)
}

const defaultFilter = () => {}
const process = ({key, values}) => {
    return key + ' and ' + String(values)
}

const postfixOuter = (text, tags) => {
    const stack = [0]
    let sum = 0
    let processedText = text

    const postfixInner = (tags) => {
        stack.push(sum)
        tags.innerTags.forEach(postfixInner)

        stack.push(tags.innerTags.length > 0
            ? sum - stack[stack.length - 1] /* stack.peek() */
            : 0
        )

        const result = process(tags.tag)

        const innerOffset = stack.pop()
        const leftOffset = stack.pop()
        const newOffset = result.length - (tags.end - tags.start)
        console.log('offsets', innerOffset, leftOffset, newOffset)

        processedText = spliceSlice(processedText, tags.start + leftOffset, tags.end + leftOffset + innerOffset, result)
        sum = innerOffset + leftOffset + newOffset
    }

    tags.forEach(postfixInner)
    return processedText
}

export default applyTemplate
