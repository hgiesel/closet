export const TAG_OPEN = '[['
export const TAG_CLOSE = ']]'

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

const spliceSlice = (text: string, repl: string, lend: number, rend: number): string => {
    // We cannot pass negative lend directly to the 2nd slicing operation.
    const leftend = lend < 0
        ? Math.min(0, text.length + lend)
        : lend

    return text.slice(0, leftend) + repl + text.slice(rend)
}

const getNewOffset = (replacement: string, lend: number, rend: number): number => {
    return replacement.length - (rend - lend)
}

export const replaceAndGetOffset = (text: string, repl: string | null, lend: number, rend: number): [string, number] => {

    return repl
        ? [
            spliceSlice(text, repl, lend, rend),
            getNewOffset(repl, lend, rend),
        ]
        : [text, 0]
}

export const removeViaBooleanList = <T>(lst: T[], booleanLst: boolean[]): T[] => {
    booleanLst.forEach((v, idx) => {
        if (v) {
            delete lst[idx]
        }
    })

    return lst.filter(Boolean)
}
