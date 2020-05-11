export const TAG_START = '[['
export const TAG_END = ']]'

export const ARG_SEP = '::'
export const ALT_SEP = '||'

const spliceSlice = (str: string, lend: number, rend: number, add: string = ''): string => {
    // We cannot pass negative lend directly to the 2nd slicing operation.
    const leftend = lend < 0
        ? Math.min(0, str.length + lend)
        : lend

    return str.slice(0, leftend) + add + str.slice(rend)
}

export const pureReplace = (
    text: string,
    replacement: string,
    lend: number,
    rend: number,
): [string, string] => {
    const newValuesRaw = text.slice(lend, rend)
    const newText = spliceSlice(text, lend, rend, replacement)

    return [
        newValuesRaw,
        newText,
    ]
}

export const calculateCoordinates = (
    tagStart: number,
    tagEnd: number,
    leftOffset: number,
    innerOffset: number,
): [number, number] => {
    return [
        tagStart + leftOffset,
        tagEnd + leftOffset + innerOffset
    ]
}

export const getNewOffset = (replacement: string, tagEnd: number, tagStart: number): number => {
    return replacement.length - (tagEnd - tagStart)
}
