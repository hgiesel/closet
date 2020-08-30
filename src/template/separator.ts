export interface Separator {
    sep: string
    max: number
    trim: boolean
    keepEmpty: boolean
}

export type WeakSeparator = Partial<Separator> | string

export function splitValues(text: string, seps: Separator[]): any {
    if (seps.length === 0) {
        return text
    }

    const [
        { sep, max, trim, keepEmpty },
        ...nextSeps
    ] = seps

    const splits = []
    let textSplit = text
    let quit = false

    while (!quit) {
        const pos = textSplit.indexOf(sep)

        const [
            currentSplit,
            rest,
            innerQuit,
        ]: [string, string, boolean] = pos < 0 || splits.length + 1 === max
            ? [
                textSplit,
                '',
                true,
            ]
            : [
                textSplit.slice(0, pos),
                textSplit.slice(pos + sep.length),
                false,
            ]

        const trimmed: string = trim
            ? currentSplit.trim()
            : currentSplit

        if (keepEmpty || trimmed.length >= 1) {
            splits.push(trimmed)
        }

        textSplit = rest
        quit = innerQuit
    }

    return splits.map(v => splitValues(v, nextSeps))
}

export const weakSeparatorToSeparator = (ws: WeakSeparator): Separator => typeof ws === 'string'
    ? {
        sep: ws,
        max: Infinity,
        trim: false,
        keepEmpty: true,
    }
    : {
        sep: ws.sep ?? '::',
        max: ws.max ?? Infinity,
        trim: ws.trim ?? false,
        keepEmpty: ws.keepEmpty ?? true,
    }
