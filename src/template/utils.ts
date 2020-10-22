export const delimiters = {
    TAG_OPEN: '[[',
    ARG_SEP: '::',
    TAG_CLOSE: ']]',
}

export const setDelimiters = (open: string, sep: string, close: string): void => {
    delimiters.TAG_OPEN = open
    delimiters.ARG_SEP = sep
    delimiters.TAG_CLOSE = close
}

export function *intersperse2d<T>(lists: T[][], delim: T): Generator<T, void, unknown> {
    let first = true

    for (const list of lists) {
        if (first) {
            first = false
        }
        else {
            yield delim
        }

        for (const item of list) {
            yield item
        }
    }
}
