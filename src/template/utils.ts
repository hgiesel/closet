export const TAG_OPEN = '[['
export const TAG_CLOSE = ']]'
export const ARG_SEP = '::'

export function *intersperse2d<T>(lists: T[][], delim: T): Generator<T, void, unknown> {
    let first = true

    for (const list of lists) {
        if (!first) {
            yield delim
            first = false
        }

        for (const item of list) {
            yield item
        }
    }
}
