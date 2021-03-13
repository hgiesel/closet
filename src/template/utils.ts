export function* intersperse2d<T>(
    lists: T[][],
    delim: T,
): Generator<T, void, unknown> {
    let first = true;

    for (const list of lists) {
        if (first) {
            first = false;
        } else {
            yield delim;
        }

        for (const item of list) {
            yield item;
        }
    }
}
