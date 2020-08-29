export interface Separator {
    sep: string
    max: number
    trim: boolean
}

export type WeakSeparator = Partial<Separator> | string

export function splitValues(text: string, seps: Separator[]): any {
    if (seps.length === 0) {
        return text
    }

    const [
        { sep, max, trim },
        ...nextSeps
    ] = seps

    const splits = []
    let textSplit = text

    do {
        const pos = textSplit.indexOf(sep)

        const [
            currentSplit,
            rest,
        ] = pos >= 0
            ? [textSplit.slice(0, pos), textSplit.slice(pos + sep.length)]
            : [textSplit, '']

        splits.push(trim
            ? currentSplit.trim()
            : currentSplit
        )

        textSplit = rest
    } while (textSplit.length > 0 && splits.length < max)

    return splits.map(v => splitValues(v, nextSeps))
}

export const weakSeparatorToSeparator = (v: WeakSeparator): Separator => typeof v === 'string'
    ? { sep: v, max: Infinity, trim: false }
    : { sep: v.sep ?? '::', max: v.max ?? Infinity, trim: v.trim ?? false }
