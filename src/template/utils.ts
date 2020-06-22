import { Status } from './replaceTags'

import type { TagInfo } from './tags'
import type { Parser } from './parser'

export const TAG_OPEN = '[['
export const TAG_CLOSE = ']]'
export const ARG_SEP = '::'

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
    return repl === null
        ? [text, 0]
        : [
            spliceSlice(text, repl, lend, rend),
            getNewOffset(repl, lend, rend),
        ]
}

export const flatMapViaStatusList = (parser: Parser, lst: TagInfo[], statusLst: Status[]): TagInfo[] => {
    return (lst as any).flatMap((tagInfo: TagInfo, idx: number) => {
        switch(statusLst[idx]) {
            case Status.Ready:
                return []
            case Status.NotReady:
                return [tagInfo]
            case Status.ContainsTags:
                return parser.rawParse(tagInfo.data.valuesText, tagInfo.start)
        }
    })
}
