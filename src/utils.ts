export const TAG_START = '[['
export const TAG_END = ']]'

export const ARG_SEP = '::'
export const ALT_SEP = '||'

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

const spliceSlice = (text: string, lend: number, rend: number, add: string = ''): string => {
    // We cannot pass negative lend directly to the 2nd slicing operation.
    const leftend = lend < 0
        ? Math.min(0, text.length + lend)
        : lend

    return text.slice(0, leftend) + add + text.slice(rend)
}

const getNewOffset = (replacement: string, lend: number, rend: number): number => {
    return replacement.length - (rend - lend)
}

export const replaceAndGetOffset = (text: string, repl: string, lend: number, rend: number): [string, number] => {
    return [
        spliceSlice(text, lend, rend),
        getNewOffset(repl, lend, rend),
    ]
}
